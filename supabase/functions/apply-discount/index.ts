/**
 * EDGE FUNCTION: apply-discount
 *
 * Valida un código de descuento para el usuario autenticado.
 * Devuelve el tipo y valor del descuento si es válido.
 *
 * POST /functions/v1/apply-discount
 * Authorization: Bearer <supabase_access_token>
 * Body: { code, cartTotal }
 */

/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ── 1. Autenticación ─────────────────────────────────────────────────────
    const authorization = req.headers.get('Authorization');
    if (!authorization) throw new Error('No autorizado');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authorization } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Sesión inválida');

    // ── 2. Parsear body ──────────────────────────────────────────────────────
    const { code, cartTotal } = await req.json();
    if (!code?.trim()) throw new Error('Código de descuento vacío');

    const cleanCode = code.trim().toUpperCase();

    // ── 3. Buscar descuento en Supabase ──────────────────────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: discount, error: discountError } = await supabaseAdmin
      .from('discounts')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .single();

    if (discountError || !discount) {
      throw new Error('Código de descuento no válido o expirado');
    }

    // ── 4. Validaciones ──────────────────────────────────────────────────────
    if (discount.expires_at && new Date(discount.expires_at) <= new Date()) {
      throw new Error('Este código de descuento ha expirado');
    }

    if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
      throw new Error('Este código de descuento ya no está disponible');
    }

    if (cartTotal < discount.min_order) {
      throw new Error(
        `Pedido mínimo para este descuento: ${discount.min_order.toFixed(2).replace('.', ',')} €`
      );
    }

    // Verificar si el usuario ya usó este código
    const { data: previousUse } = await supabaseAdmin
      .from('discount_usages')
      .select('id')
      .eq('discount_id', discount.id)
      .eq('user_id', user.id)
      .single();

    if (previousUse) {
      throw new Error('Ya has utilizado este código de descuento anteriormente');
    }

    // ── 5. Calcular ahorro ───────────────────────────────────────────────────
    let savings = 0;
    const total = Number(cartTotal);

    if (discount.type === 'percentage') {
      savings = total * (discount.value / 100);
    } else if (discount.type === 'fixed') {
      savings = Math.min(discount.value, total);
    } else if (discount.type === 'free_shipping') {
      savings = total >= 50 ? 0 : 3.99;
    }

    return new Response(
      JSON.stringify({
        valid:    true,
        code:     cleanCode,
        type:     discount.type,
        value:    discount.value,
        savings:  Math.round(savings * 100) / 100,
        message:  buildDiscountMessage(discount.type, discount.value, savings),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al validar el descuento';
    return new Response(
      JSON.stringify({ valid: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

function buildDiscountMessage(type: string, value: number, savings: number): string {
  if (type === 'percentage') {
    return `¡${value}% de descuento aplicado! Ahorras ${savings.toFixed(2).replace('.', ',')} €`;
  }
  if (type === 'fixed') {
    return `¡Descuento de ${value.toFixed(2).replace('.', ',')} € aplicado!`;
  }
  if (type === 'free_shipping') {
    return savings > 0 ? '¡Envío gratuito aplicado!' : 'Tu pedido ya tiene envío gratis';
  }
  return 'Descuento aplicado';
}
