#!/usr/bin/env node
// migrate2.mjs — sube solo los productos que faltan en Sanity
import { createClient } from '@sanity/client';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.argv[2];
if (!TOKEN) {
  console.error('Uso: node scripts/migrate2.mjs TU_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: 'wcz82277',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

// Cargar productos
const { products } = await import(pathToFileURL(path.join(__dirname, '../src/data/products.js')).href);

console.log(`Total en products.js: ${products.length}`);

// Ver qué IDs ya están en Sanity
const existing = await client.fetch(`*[_type=="product"]._id`);
const existingSet = new Set(existing);
console.log(`Ya en Sanity: ${existing.length}`);

const missing = products.filter(p => !existingSet.has(`product-${p.id}`));
console.log(`A subir: ${missing.length}`);

let ok = 0, fail = 0;

for (const product of missing) {
  const slug = product.name.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  try {
    await client.createOrReplace({
      _id: `product-${product.id}`,
      _type: 'product',
      name: product.name,
      slug: { _type: 'slug', current: slug },
      price: product.price,
      ...(product.originalPrice && { originalPrice: product.originalPrice }),
      category: product.category,
      ...(product.subcategory && { subcategory: product.subcategory }),
      tags: product.tags || [],
      description: product.description || '',
      sizes: product.sizes || [],
      active: true,
      featured: product.tags?.includes('Destacado') || false,
    });
    console.log(`✅ ${product.name}`);
    ok++;
  } catch (err) {
    console.error(`❌ ${product.name}: ${err.message}`);
    fail++;
  }
}

console.log(`\n✅ ${ok} subidos | ❌ ${fail} errores`);
const total = await client.fetch(`count(*[_type=="product"])`);
console.log(`Total en Sanity ahora: ${total}`);
