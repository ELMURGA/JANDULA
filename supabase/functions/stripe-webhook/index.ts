/**
 * EDGE FUNCTION: stripe-webhook
 *
 * Recibe los eventos de Stripe (especialmente checkout.session.completed).
 * - Verifica la firma del webhook de Stripe
 * - Llama a process_order_server_side para crear el pedido y reducir stock
 * - Invoca send-email para enviar el email de confirmación al cliente
 *
 * Esta función NO requiere JWT de usuario.
 * La seguridad la proporciona la verificación de firma de Stripe.
 *
 * POST /functions/v1/stripe-webhook
 * stripe-signature: <stripe_signature_header>
 */

/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Firma de Stripe ausente', { status: 400 });
  }

  const body = await req.text();

  // ── 1. Verificar firma de Stripe ────────────────────────────────────────
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2024-06-20',
  } as any);

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    console.error('⚠️  Firma de Stripe inválida:', msg);
    return new Response(`Webhook error: ${msg}`, { status: 400 });
  }

  // ── 2. Manejar evento checkout.session.completed ─────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    // Solo procesar pagos completados (no "payment pending")
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true, skipped: 'payment_pending' }), {
        status: 200,
      });
    }

    const meta = session.metadata!;

    // Parsear carrito desde metadata
    let cartItems: Array<{ id: number; quantity: number; size: string | null }>;
    try {
      cartItems = JSON.parse(meta.cart_items);
    } catch {
      console.error('Error al parsear cart_items del metadata');
      return new Response('Error en metadata', { status: 500 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── 3. Crear el pedido en Supabase ──────────────────────────────────────
    const { data: orderData, error: orderError } = await supabase.rpc(
      'process_order_server_side',
      {
        p_user_id:               meta.user_id,
        p_items:                 cartItems,
        p_shipping_info: {
          name:    meta.shipping_name,
          address: meta.shipping_address,
          city:    meta.shipping_city,
          postal:  meta.shipping_postal,
          phone:   meta.shipping_phone,
          notes:   meta.notes,
        },
        p_stripe_session_id:     session.id,
        p_stripe_payment_intent: session.payment_intent as string,
        p_discount_code:         meta.discount_code || null,
        p_discount_amount:       parseFloat(meta.discount_amount || '0'),
      }
    );

    if (orderError) {
      console.error('❌ Error al crear pedido:', orderError.message);
      // Devolvemos 500 para que Stripe reintente el webhook
      return new Response(JSON.stringify({ error: orderError.message }), { status: 500 });
    }

    console.log(`✅ Pedido creado: #${orderData.order_id}`);

    // ── 4. Enviar email de confirmación ─────────────────────────────────────
    const customerEmail = session.customer_email;
    if (customerEmail) {
      try {
        const emailRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            to:           customerEmail,
            orderId:      orderData.order_id,
            customerName: meta.shipping_name,
            items:        orderData.items,
            subtotal:     orderData.subtotal,
            shipping:     orderData.shipping,
            discount:     orderData.discount,
            total:        orderData.total,
            shippingAddress: {
              address: meta.shipping_address,
              city:    meta.shipping_city,
              postal:  meta.shipping_postal,
              phone:   meta.shipping_phone,
            },
          }),
        });

        if (!emailRes.ok) {
          const emailErr = await emailRes.text();
          console.error('⚠️ send-email devolvió error:', emailErr);
        }
      } catch (emailErr) {
        // El email es no-crítico: loguear el error pero no fallar el webhook
        console.error('⚠️  Error al enviar email:', emailErr);
      }
    }

    // ── 5. Notificación al administrador ────────────────────────────────────
    try {
      const adminEmailRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          to:              'jandulamodautrera@gmail.com',
          subject:         `🛒 Nuevo pedido #${orderData.order_id} — ${meta.shipping_name}`,
          orderId:         orderData.order_id,
          customerName:    meta.shipping_name,
          items:           orderData.items,
          subtotal:        orderData.subtotal,
          shipping:        orderData.shipping,
          discount:        orderData.discount,
          total:           orderData.total,
          shippingAddress: {
            address: meta.shipping_address,
            city:    meta.shipping_city,
            postal:  meta.shipping_postal,
            phone:   meta.shipping_phone,
          },
          adminPanelLink: 'https://jandulamodautrera.es/admin',
        }),
      });

      if (!adminEmailRes.ok) {
        const adminEmailErr = await adminEmailRes.text();
        console.error('⚠️ Notificación admin error:', adminEmailErr);
      } else {
        console.log(`✅ Notificación enviada a admin para pedido #${orderData.order_id}`);
      }
    } catch (adminEmailErr) {
      console.error('⚠️  Error al enviar notificación admin:', adminEmailErr);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
