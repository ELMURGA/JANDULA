#!/usr/bin/env node

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.SANITY_MANAGEMENT_TOKEN || process.env.SANITY_ADMIN_TOKEN;
const webhookToken = process.env.SANITY_WEBHOOK_SECRET;
const apiVersion = 'v2025-02-19';
const hookName = 'sync-products-supabase';
const hookUrl = 'https://aadjazenpqldtvnxqksr.supabase.co/functions/v1/sync-products';

if (!token) {
  console.error('Falta SANITY_MANAGEMENT_TOKEN o SANITY_ADMIN_TOKEN');
  process.exit(1);
}

if (!webhookToken) {
  console.error('Falta SANITY_WEBHOOK_SECRET');
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