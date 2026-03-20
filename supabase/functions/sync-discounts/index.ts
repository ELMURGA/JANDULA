/// <reference path="../global.d.ts" />

/**
 * EDGE FUNCTION: sync-discounts
 *
 * Lee los cupones de descuento de Sanity y los sincroniza con la tabla
 * `discounts` de Supabase. Se puede llamar:
 *   - Desde un webhook de Sanity (al guardar un cupón)
 *   - Manualmente desde el panel de admin
 *
 * POST /functions/v1/sync-discounts
 * Authorization: Bearer <anon_key> | x-webhook-token: <secret>
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SANITY_PROJECT_ID = 'wcz82277';
const SANITY_DATASET    = 'production';
const SANITY_API_VERSION = '2024-01-01';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Autenticación: anon key o webhook token
    const authorization   = req.headers.get('Authorization') ?? '';
    const webhookToken    = req.headers.get('x-webhook-token') ?? '';
    const expectedAnon    = `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;
    const expectedWebhook = Deno.env.get('SANITY_WEBHOOK_SECRET') ?? '';

    const isAuthorized =
      authorization === expectedAnon ||
      (expectedWebhook !== '' && webhookToken === expectedWebhook);

    if (!isAuthorized) {
      return json({ success: false, error: 'No autorizado' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Leer cupones desde Sanity
    const query = `*[_type == "discount"] {
      _id,
      code,
      description,
      type,
      value,
      min_order,
      max_uses,
      is_active,
      expires_at
    }`;

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const sanityRes = await fetch(url);

    if (!sanityRes.ok) {
      throw new Error(`Error al leer Sanity: ${sanityRes.status}`);
    }

    const { result: discounts } = await sanityRes.json();

    if (!Array.isArray(discounts) || discounts.length === 0) {
      return json({ success: true, synced: 0, message: 'No hay cupones en Sanity' });
    }

    // 2. Construir filas para Supabase (sin used_count para no resetear el contador)
    const rows = discounts
      .filter((d: any) => d.code)
      .map((d: any) => ({
        code:        String(d.code).toUpperCase().trim(),
        type:        d.type || 'percentage',
        value:       Number(d.value ?? 0),
        min_order:   Number(d.min_order ?? 0),
        max_uses:    d.max_uses ? Number(d.max_uses) : null,
        is_active:   d.is_active !== false,
        expires_at:  d.expires_at || null,
      }));

    // 3. Upsert en Supabase usando el code como clave única
    const { error, count } = await supabase
      .from('discounts')
      .upsert(rows, { onConflict: 'code', ignoreDuplicates: false })
      .select();

    if (error) throw error;

    console.log(`✅ sync-discounts: ${rows.length} cupones sincronizados`);
    return json({ success: true, synced: rows.length });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('❌ sync-discounts error:', message);
    return json({ success: false, error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}
