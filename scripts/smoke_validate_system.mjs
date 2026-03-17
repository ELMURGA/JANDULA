#!/usr/bin/env node

const env = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnon: process.env.VITE_SUPABASE_ANON_KEY,
  supabaseService: process.env.SUPABASE_SERVICE_ROLE_KEY,
  sanityProjectId: process.env.VITE_SANITY_PROJECT_ID || 'wcz82277',
  sanityDataset: process.env.VITE_SANITY_DATASET || 'production',
  sanityApiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  webhookSecret: process.env.SANITY_WEBHOOK_SECRET,
};

const missing = Object.entries(env)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error('Faltan variables de entorno:', missing.join(', '));
  process.exit(1);
}

const result = {
  sanity: { ok: false, products: 0 },
  syncFunction: { ok: false, upserted: 0, deactivated: 0 },
  supabase: { ok: false, products: 0, recentOrders: 0, warnings: [] },
};

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} :: ${JSON.stringify(json)}`);
  }
  return json;
}

try {
  const sanityQuery = `count(*[_type == "product" && active == true])`;
  const sanityUrl = `https://${env.sanityProjectId}.api.sanity.io/v${env.sanityApiVersion}/data/query/${env.sanityDataset}?query=${encodeURIComponent(sanityQuery)}`;
  const sanityRes = await fetchJson(sanityUrl);
  result.sanity.products = sanityRes.result || 0;
  result.sanity.ok = Number(result.sanity.products) > 0;

  const syncRes = await fetchJson(`${env.supabaseUrl}/functions/v1/sync-products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-token': env.webhookSecret,
    },
    body: JSON.stringify({ source: 'smoke-test' }),
  });
  result.syncFunction.ok = !!syncRes.success;
  result.syncFunction.upserted = syncRes.upserted || 0;
  result.syncFunction.deactivated = syncRes.deactivated || 0;

  const productsRes = await fetchJson(`${env.supabaseUrl}/rest/v1/products?select=id`, {
    headers: {
      apikey: env.supabaseAnon,
      Authorization: `Bearer ${env.supabaseAnon}`,
      Prefer: 'count=exact',
    },
  });
  result.supabase.products = Array.isArray(productsRes) ? productsRes.length : 0;

  if (env.supabaseService) {
    try {
      const ordersRes = await fetchJson(`${env.supabaseUrl}/rest/v1/orders?select=id&order=created_at.desc&limit=5`, {
        headers: {
          apikey: env.supabaseService,
          Authorization: `Bearer ${env.supabaseService}`,
        },
      });
      result.supabase.recentOrders = Array.isArray(ordersRes) ? ordersRes.length : 0;
    } catch (error) {
      result.supabase.warnings.push('No se pudo leer orders con service role local (posible clave desfasada en .env).');
    }
  }
  result.supabase.ok = result.supabase.products > 0;

  const allOk = result.sanity.ok && result.syncFunction.ok && result.supabase.ok;
  console.log(JSON.stringify({ ok: allOk, result }, null, 2));
  process.exit(allOk ? 0 : 2);
} catch (error) {
  console.error('Smoke test error:', error.message || error);
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
