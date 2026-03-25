/// <reference path="../global.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const SANITY_PROJECT_ID = 'wcz82277';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get('Authorization') ?? '';
    const expected = `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;
    const webhookToken = req.headers.get('x-webhook-token') ?? '';
    const expectedWebhookToken = Deno.env.get('SANITY_WEBHOOK_SECRET') ?? '';
    const isAuthorized =
      authorization === expected ||
      (expectedWebhookToken !== '' && webhookToken === expectedWebhookToken);

    if (!isAuthorized) {
      return new Response(JSON.stringify({ success: false, error: 'No autorizado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const query = `*[_type == "product"] {
      _id,
      name,
      slug,
      price,
      originalPrice,
      category,
      subcategory,
      tags,
      "image": image.asset->url,
      description,
      sizes,
      active
    } | order(_createdAt asc)`;

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const sanityRes = await fetch(url);

    if (!sanityRes.ok) {
      throw new Error(`No se pudo leer Sanity: ${sanityRes.status} ${sanityRes.statusText}`);
    }

    const sanityJson = await sanityRes.json();
    const products = sanityJson.result ?? [];

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Sanity no devolvió productos');
    }

    const rows = products
      .map((product: any) => {
        const sanityId = String(product._id ?? '').trim();
        if (!sanityId) return null;

        return {
          sanity_id: sanityId,
          name: product.name,
          slug: product.slug?.current ?? null,
          price: product.price,
          original_price: product.originalPrice ?? null,
          category: product.category,
          subcategory: product.subcategory ?? null,
          tags: product.tags ?? [],
          image: product.image ?? null,
          description: product.description ?? null,
          sizes: product.sizes ?? [],
          is_active: product.active !== false,
        };
      })
      .filter(Boolean);

    const syncedSanityIds = rows.map((row: any) => row.sanity_id as string);

    let upserted = 0;

    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'sanity_id' });

      if (error) {
        throw new Error(`Fallo al sincronizar lote ${i / 50 + 1}: ${error.message}`);
      }

      upserted += batch.length;
    }

    // Desactivar productos que ya no existen en Sanity
    let deactivated = 0;
    if (syncedSanityIds.length > 0) {
      // Obtener todos los productos activos para comparar por sanity_id
      const { data: activeRows, error: activeError } = await supabase
        .from('products')
        .select('id, sanity_id')
        .eq('is_active', true);

      if (activeError) {
        throw new Error(`Fallo al revisar productos activos: ${activeError.message}`);
      }

      if (activeRows && activeRows.length > 0) {
        const staleIds = activeRows
          .filter((row: { id: number; sanity_id: string | null }) =>
            row.sanity_id !== null && !syncedSanityIds.includes(row.sanity_id)
          )
          .map((row: { id: number }) => row.id);

        if (staleIds.length > 0) {
          const { error: deactivateError } = await supabase
            .from('products')
            .update({ is_active: false })
            .in('id', staleIds);

          if (deactivateError) {
            throw new Error(`Fallo al desactivar productos obsoletos: ${deactivateError.message}`);
          }

          deactivated = staleIds.length;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, fetched: products.length, upserted, deactivated }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
