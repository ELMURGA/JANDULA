#!/usr/bin/env node

/**
 * Registra o actualiza el webhook de Sanity → Supabase sync-products.
 *
 * Requisitos:
 *   SANITY_MANAGEMENT_TOKEN → Token personal de administrador (NO el WRITE_TOKEN del proyecto)
 *     Cómo obtenerlo: https://www.sanity.io/manage → Click en tu avatar → API Tokens
 *     Crear token: nombre "management", permisos: Administrator.
 *
 *   SANITY_WEBHOOK_SECRET → El secreto configurado en Supabase edge functions.
 *     Valor actual: a332592211e6d176b702962bcd7ed45c859a00217edfa052cf67ca7828fe33c4
 *
 * Uso:
 *   SANITY_MANAGEMENT_TOKEN=sk... SANITY_WEBHOOK_SECRET=a332... node scripts/setup_sanity_webhook.mjs
 *
 * ─── ALTERNATIVA MANUAL (si no tienes el management token) ──────────────────
 * 1. Ve a: https://www.sanity.io/manage/personal/project/wcz82277/api/webhooks
 * 2. Crea un nuevo webhook con estos datos:
 *    - Name:    sync-products-supabase
 *    - URL:     https://aadjazenpqldtvnxqksr.supabase.co/functions/v1/sync-products
 *    - Dataset: production
 *    - Trigger on: Create, Update, Delete
 *    - Filter:  _type == "product"
 *    - HTTP Method: POST
 *    - Secret (header x-webhook-token):
 *              a332592211e6d176b702962bcd7ed45c859a00217edfa052cf67ca7828fe33c4
 * ────────────────────────────────────────────────────────────────────────────
 */

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_MANAGEMENT_TOKEN || process.env.SANITY_ADMIN_TOKEN;
const webhookToken = process.env.SANITY_WEBHOOK_SECRET;
const apiVersion = 'v2025-02-19';
const hookName = 'sync-products-supabase';
const hookUrl = 'https://aadjazenpqldtvnxqksr.supabase.co/functions/v1/sync-products';

if (!token) {
  console.error('\n❌ Falta SANITY_MANAGEMENT_TOKEN');
  console.error('\nNecesitas un token PERSONAL de administrador (distinto al WRITE_TOKEN):');
  console.error('  1. Ve a https://www.sanity.io/manage → click en tu avatar → "API Tokens"');
  console.error('  2. "+ New token" → nombre: management → rol: Administrator');
  console.error('  3. Ejecuta: SANITY_MANAGEMENT_TOKEN=sk... SANITY_WEBHOOK_SECRET=a332592211e6d176b702962bcd7ed45c859a00217edfa052cf67ca7828fe33c4 node scripts/setup_sanity_webhook.mjs');
  console.error('\nO crea el webhook manualmente en:');
  console.error('  https://www.sanity.io/manage/personal/project/wcz82277/api/webhooks');
  process.exit(1);
}

if (!webhookToken) {
  console.error('❌ Falta SANITY_WEBHOOK_SECRET');
  console.error('Valor actual: a332592211e6d176b702962bcd7ed45c859a00217edfa052cf67ca7828fe33c4');
  process.exit(1);
}

const baseUrl = `https://api.sanity.io/${apiVersion}/hooks/projects/${projectId}`;
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const desiredBody = {
  type: 'document',
  name: hookName,
  description: 'Sincroniza productos de Sanity a Supabase para checkout',
  dataset,
  url: hookUrl,
  rule: {
    on: ['create', 'update', 'delete'],
    filter: '_type == "product"',
    projection: '{"_id": _id}',
  },
  httpMethod: 'POST',
  apiVersion,
  includeDrafts: false,
  headers: {
    'x-webhook-token': webhookToken,
  },
};

const listRes = await fetch(baseUrl, { headers });
if (!listRes.ok) {
  console.error(await listRes.text());
  process.exit(1);
}

const hooks = await listRes.json();
const existing = Array.isArray(hooks) ? hooks.find((hook) => hook.name === hookName) : null;

if (!existing) {
  const createRes = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(desiredBody),
  });

  const payload = await createRes.text();
  console.log(payload);
  process.exit(createRes.ok ? 0 : 1);
}

console.log(JSON.stringify({
  created: false,
  existing: true,
  id: existing.id,
  url: existing.url,
  isDisabled: existing.isDisabled,
}, null, 2));