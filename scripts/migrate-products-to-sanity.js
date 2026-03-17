/**
 * 🔄 SCRIPT DE MIGRACIÓN: products.js → Sanity
 * 
 * Uso: node scripts/migrate-products-to-sanity.js
 * 
 * Este script lee todos los productos del archivo src/data/products.js
 * y los sube a Sanity Studio usando la API de Management.
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer variables de entorno
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const sanityToken = process.env.SANITY_WRITE_TOKEN; // Necesitas obtener esto

if (!sanityToken) {
  console.error('❌ Error: SANITY_WRITE_TOKEN no está configurado.');
  console.error('Para obtenerlo:');
  console.error('1. Ve a https://manage.sanity.io/projects');
  console.error('2. Selecciona tu proyecto "jandula-moda"');
  console.error('3. API > Tokens > + Add API Token');
  console.error('4. Nombre: "migrate-products"');
  console.error('5. Permisos: Editor (para crear/editar documentos)');
  console.error('6. Copia el token y añádelo a tu .env como SANITY_WRITE_TOKEN=tu_token');
  process.exit(1);
}

// Cliente de Sanity con permisos de escritura
const client = createClient({
  projectId,
  dataset,
  token: sanityToken,
  apiVersion: '2024-01-01',
  useCdn: false, // No usar CDN para writes
});

// Importar productos del archivo local
const productsPath = path.join(__dirname, '../src/data/products.js');
const productsModule = await import(productsPath);
const { products: productsData } = productsModule;

console.log(`📦 Leyendo ${productsData.length} productos de products.js...`);

// Transformar cada producto al formato de Sanity
async function migrateProducts() {
  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
    try {
      // Crear documento compatible con Sanity schema
      const sanityId = `product-${product.id}`;
      const slug = product.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quitar tildes
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      const sanityProduct = {
        _id: sanityId,
        _type: 'product',
        name: product.name,
        slug: {
          _type: 'slug',
          current: slug,
        },
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        category: product.category,
        subcategory: product.subcategory || undefined,
        tags: product.tags || [],
        description: product.description || '',
        sizes: product.sizes || [],
        active: true,
        featured: product.tags?.includes('Destacado') || false,
      };

      // Crear o actualizar el producto en Sanity
      // Usar upsert con slug como identificador
      const createdProduct = await client.createOrReplace(sanityProduct);

      console.log(`✅ ${product.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error migrando ${product.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Migración completada:`);
  console.log(`   ✅ Exitosos: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`\n⚠️  IMPORTANTE:`);
  console.log(`   Las imágenes NO se han subido. Necesitas:`);
  console.log(`   1. Ir a Sanity Studio: https://wcz82277.sanity.studio`);
  console.log(`   2. Para cada producto, añadir la imagen manualmente`);
  console.log(`   3. O usar un script de upload de imágenes (próximo paso)`);
}

migrateProducts();
