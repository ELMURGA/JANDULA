#!/usr/bin/env node

/**
 * Registra (o actualiza) el webhook de Sanity que dispara send-back-in-stock
 * automáticamente cuando outOfStock cambia a false en un producto.
 *
 * Uso:
 *   SANITY_MANAGEMENT_TOKEN=<token> SANITY_WEBHOOK_SECRET=<secret> node scripts/setup_back_in_stock_webhook.mjs
 */

const projectId  = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset    = process.env.VITE_SANITY_DATASET    || 'production';
const token      = process.env.SANITY_MANAGEMENT_TOKEN || process.env.SANITY_ADMIN_TOKEN;
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
const apiVersion = 'v2025-02-19';

const hookName = 'back-in-stock-notifications';
const hookUrl  = 'https://aadjazenpqldtvnxqksr.supabase.co/functions/v1/send-back-in-stock';

if (!token) {
  console.error('❌  Falta SANITY_MANAGEMENT_TOKEN o SANITY_ADMIN_TOKEN');
  process.exit(1);
}

if (!webhookSecret) {
  console.error('❌  Falta SANITY_WEBHOOK_SECRET');
  process.exit(1);
}

const baseUrl = `https://api.sanity.io/${apiVersion}/hooks/projects/${projectId}`;
const headers = {
  Authorization:  `Bearer ${token}`,
  'Content-Type': 'application/json',
};

// Proyección: Sanity envía estos campos al Edge Function
const desiredBody = {
  type:        'document',
  name:        hookName,
  description: 'Avisa automáticamente a clientes cuando un producto vuelve a tener stock',
  dataset,
  url:         hookUrl,
  rule: {
    on:         ['update'],          // Solo en actualización (no en crear/borrar)
    filter:     '_type == "product"',
    projection: `{
      "productSlug": slug.current,
      "productName": name,
      "outOfStock":  outOfStock
    }`,
  },
  httpMethod:    'POST',
  apiVersion,
  includeDrafts: false,
  headers: {
    'x-webhook-token': webhookSecret,
  },
};

// Listar webhooks existentes
const listRes = await fetch(baseUrl, { headers });
if (!listRes.ok) {
  console.error('❌  Error al listar webhooks:', await listRes.text());
  process.exit(1);
}

const hooks    = await listRes.json();
const existing = Array.isArray(hooks) ? hooks.find((h) => h.name === hookName) : null;

if (existing) {
  // Actualizar
  const updateRes = await fetch(`${baseUrl}/${existing.id}`, {
    method:  'PUT',
    headers,
    body:    JSON.stringify(desiredBody),
  });
  const result = await updateRes.text();
  if (updateRes.ok) {
    console.log(`✅  Webhook actualizado (id: ${existing.id})`);
    console.log(`    URL: ${hookUrl}`);
  } else {
    console.error('❌  Error al actualizar:', result);
    process.exit(1);
  }
} else {
  // Crear
  const createRes = await fetch(baseUrl, {
    method:  'POST',
    headers,
    body:    JSON.stringify(desiredBody),
  });
  const result = await createRes.text();
  if (createRes.ok) {
    const parsed = JSON.parse(result);
    console.log(`✅  Webhook creado (id: ${parsed.id})`);
    console.log(`    URL: ${hookUrl}`);
  } else {
    console.error('❌  Error al crear:', result);
    process.exit(1);
  }
}
