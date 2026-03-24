/**
 * EDGE FUNCTION: create-checkout
 *
 * Crea una Stripe Checkout Session a partir del carrito del usuario.
 * - Verifica precios server-side (anti-manipulación)
 * - Valida stock en Supabase
 * - Aplica descuentos opcionales
 * - Devuelve la URL de Stripe Checkout Hosted
 *
 * POST /functions/v1/create-checkout
 * Authorization: Bearer <supabase_access_token>
 * Body: { cartItems, shippingInfo, discountCode? }
 */

/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── 1. Autenticación: verificar JWT del usuario ──────────────────────────
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      throw new Error('No autorizado: falta el token de autenticación');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authorization } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('No autorizado: sesión inválida o expirada');
    }

    // ── 2. Parsear body ──────────────────────────────────────────────────────
    const { cartItems, shippingInfo, discountCode, deliveryMethod } = await req.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }
    if (!shippingInfo?.name?.trim()) {
      throw new Error('El nombre de contacto es obligatorio');
    }
    if (deliveryMethod !== 'pickup' && !shippingInfo?.address?.trim()) {
      throw new Error('La dirección de envío es obligatoria');
    }

    // ── 3. Verificar precios server-side (Supabase como fuente de verdad) ────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Extraer IDs numéricos (los cartItems.id vienen como número entero)
    const productIds = cartItems.map((item: { id: number }) => Number(item.id));

    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, image, stock, is_active')
      .in('id', productIds);

    if (productsError) {
      throw new Error('Error al verificar los productos: ' + productsError.message);
    }

    // ── 4. Construir line_items de Stripe con precios del servidor ───────────
    const lineItems: any[] = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
      const dbProduct = (dbProducts ?? []).find((p: { id: number }) => p.id === Number(cartItem.id));

      if (!dbProduct) {
        throw new Error(`Producto no encontrado: ${cartItem.name || cartItem.id}`);
      }
      if (!dbProduct.is_active) {
        throw new Error(`Producto no disponible: "${dbProduct.name}"`);
      }
      if (dbProduct.stock < cartItem.quantity) {
        throw new Error(
          `Stock insuficiente para "${dbProduct.name}". Disponible: ${dbProduct.stock}`
        );
      }

      const unitPrice = Math.round(Number(dbProduct.price) * 100); // céntimos
      subtotal += Number(dbProduct.price) * cartItem.quantity;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: dbProduct.name,
            // Imagen de Supabase si existe; si no, cadena vacía (Stripe la omite)
            ...(dbProduct.image ? { images: [dbProduct.image] } : {}),
            metadata: { productId: String(dbProduct.id) },
          },
          unit_amount: unitPrice,
        },
        quantity: cartItem.quantity,
      });
    }

    // ── 5. Gastos de envío ───────────────────────────────────────────────────
    const isPickup = deliveryMethod === 'pickup';
    const shippingCost = (isPickup || subtotal >= 100) ? 0 : 3.99;
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Gastos de Envío' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // ── 6. Validar y aplicar descuento (opcional) ────────────────────────────
    let stripeCouponId: string | undefined;
    let discountAmount = 0;
    let resolvedDiscountCode: string | null = null;

    if (discountCode?.trim()) {
      const cleanCode = discountCode.trim().toUpperCase();

      const { data: discount } = await supabaseAdmin
        .from('discounts')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single();

      if (discount) {
        const isExpired = discount.expires_at && new Date(discount.expires_at) <= new Date();
        const isMaxed  = discount.max_uses !== null && discount.used_count >= discount.max_uses;

        if (!isExpired && !isMaxed && subtotal >= discount.min_order) {
          resolvedDiscountCode = cleanCode;

          if (discount.type === 'percentage') {
            discountAmount = subtotal * (discount.value / 100);
          } else if (discount.type === 'fixed') {
            discountAmount = Math.min(discount.value, subtotal);
          } else if (discount.type === 'free_shipping') {
            discountAmount = shippingCost; // elimina el coste de envío
          }

          if (discountAmount > 0) {
            const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
              apiVersion: '2024-06-20',
            } as any);

            const coupon = await stripe.coupons.create({
              ...(discount.type === 'percentage'
                ? { percent_off: discount.value }
                : { amount_off: Math.round(discountAmount * 100), currency: 'eur' }),
              duration: 'once',
              name: `Descuento ${cleanCode}`,
            });
            stripeCouponId = coupon.id;
          }
        }
      }
    }

    // ── 7. Crear Stripe Checkout Session ────────────────────────────────────
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2024-06-20',
    } as any);

    const origin = req.headers.get('origin') ?? 'https://jandulamodautrera.es';

    // El metadata guarda todo lo que el webhook necesitará para crear el pedido
    const metadata: Record<string, string> = {
      user_id:          user.id,
      shipping_name:    shippingInfo.name,
      shipping_address: shippingInfo.address,
      shipping_city:    shippingInfo.city,
      shipping_postal:  shippingInfo.postal,
      shipping_phone:   shippingInfo.phone,
      notes:            shippingInfo.notes || '',
      discount_code:    resolvedDiscountCode ?? '',
      discount_amount:  String(discountAmount),
      delivery_method:  isPickup ? 'pickup' : 'shipping',
      // Sólo guardamos id, quantity, size, color (los precios se vuelven a verificar en el webhook)
      cart_items: JSON.stringify(
        cartItems.map((item: { id: number; quantity: number; size?: string; color?: string }) => ({
          id:       Number(item.id),
          quantity: item.quantity,
          size:     item.size ?? null,
          color:    item.color ?? null,
        }))
      ),
    };

    const sessionParams: any = {
      // Sin payment_method_types → Stripe Checkout muestra automáticamente
      // todos los métodos activos en el Dashboard (Bizum, Apple Pay, Google Pay, etc.)
      line_items:           lineItems,
      mode:                 'payment',
      success_url:          `${origin}/pedido-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:           `${origin}/carrito?pago_cancelado=1`,
      customer_email:       user.email!,
      locale:               'es',
      metadata,
      ...(!stripeCouponId ? { allow_promotion_codes: true } : {}),
      ...(stripeCouponId ? { discounts: [{ coupon: stripeCouponId }] } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ sessionUrl: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
