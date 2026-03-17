#!/usr/bin/env node
/**
 * 🖼️  SCRIPT: Sube imágenes de /public/images/products/ a Sanity
 *    y las asigna automáticamente a cada producto.
 *
 * Uso: node scripts/upload-images.mjs TU_TOKEN
 */
import { createClient } from '@sanity/client';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const TOKEN = process.argv[2];
if (!TOKEN) {
  console.error('Uso: node scripts/upload-images.mjs TU_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: 'wcz82277',
  dataset:   'production',
  apiVersion:'2024-01-01',
  token:     TOKEN,
  useCdn:    false,
});

const IMAGES_DIR = path.join(__dirname, '../public/images/products');

// Cargar lista de productos (id → ruta de imagen)
const { products } = await import(
  pathToFileURL(path.join(__dirname, '../src/data/products.js')).href
);

// Obtener IDs de productos que YA tienen imagen en Sanity
const docsWithImage = await client.fetch(
  '*[_type=="product" && defined(image)]{ _id }'
);
const alreadyDone = new Set(docsWithImage.map(d => d._id));
console.log(`\n🖼️  Procesando imágenes de ${products.length} productos...`);
console.log(`⏩  Ya tienen imagen en Sanity: ${alreadyDone.size}\n`);

let uploaded = 0, skipped = 0, errors = 0;

for (const product of products) {
  const docId = `product-${product.id}`;

  // Saltar si ya tiene imagen asignada en Sanity
  if (alreadyDone.has(docId)) {
    skipped++;
    continue;
  }

  // Extraer nombre de archivo de la ruta /images/products/xxx.webp
  const imagePath = product.image; // ej: /images/products/bolsos-bolso-boho.webp
  if (!imagePath) {
    console.log(`⏭️  Sin imagen local: ${product.name}`);
    skipped++;
    continue;
  }

  const fileName  = path.basename(imagePath);          // bolsos-bolso-boho.webp
  const localPath = path.join(IMAGES_DIR, fileName);   // /…/public/images/products/bolsos-bolso-boho.webp

  if (!existsSync(localPath)) {
    console.log(`⚠️  No encontrada: ${fileName} (${product.name})`);
    skipped++;
    continue;
  }

  try {
    // 1. Subir la imagen al asset store de Sanity (conserva el original)
    const asset = await client.assets.upload(
      'image',
      createReadStream(localPath),
      {
        filename: fileName,
        contentType: fileName.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      }
    );

    // 2. Asignar el asset al campo `image` del documento del producto
    await client
      .patch(docId)
      .set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit();

    console.log(`✅ ${product.name}`);
    uploaded++;
  } catch (err) {
    console.error(`❌ ${product.name}: ${err.message}`);
    errors++;
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RESUMEN SUBIDA DE IMÁGENES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Subidas correctamente     : ${uploaded}
⏭️  Ya tenían imagen (omitidas): ${skipped}
❌ Errores                     : ${errors}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
