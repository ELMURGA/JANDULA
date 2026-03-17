import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('No autorizado');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authorization } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Sesion invalida o expirada');
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error('Falta sessionId');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id, stripe_session_id')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (existingOrder) {
      return json({ success: true, alreadyProcessed: true, orderId: existingOrder.id });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2024-06-20',
    } as Stripe.StripeConfig);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== 'paid') {
      throw new Error('La sesion de Stripe aun no aparece como pagada');
    }

    const meta = session.metadata ?? {};
    if (meta.user_id !== user.id) {
      throw new Error('La sesion no pertenece al usuario autenticado');
    }

    const cartItems = JSON.parse(meta.cart_items || '[]');
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('La sesion no contiene productos validos');
    }

    const { data: orderData, error: orderError } = await supabaseAdmin.rpc(
      'process_order_server_side',
      {
        p_user_id: meta.user_id,
        p_items: cartItems,
        p_shipping_info: {
          name: meta.shipping_name,
          address: meta.shipping_address,
          city: meta.shipping_city,
          postal: meta.shipping_postal,
          phone: meta.shipping_phone,
          notes: meta.notes,
        },
        p_stripe_session_id: session.id,
        p_stripe_payment_intent: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
        p_discount_code: meta.discount_code || null,
        p_discount_amount: parseFloat(meta.discount_amount || '0'),
      }
    );

    if (orderError) {
      throw new Error(orderError.message);
    }

    if (session.customer_email) {
      const emailRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          to: session.customer_email,
          orderId: orderData.order_id,
          customerName: meta.shipping_name,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          discount: orderData.discount,
          total: orderData.total,
          shippingAddress: {
            address: meta.shipping_address,
            city: meta.shipping_city,
            postal: meta.shipping_postal,
            phone: meta.shipping_phone,
          },
        }),
      });

      if (!emailRes.ok) {
        const emailErr = await emailRes.text();
        console.error('⚠️ Error enviando email desde confirm-order:', emailErr);
      }
    }

    return json({ success: true, alreadyProcessed: false, orderId: orderData.order_id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al confirmar el pedido';
    return json({ success: false, error: message }, 400);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}