/**
 * 🔄 MIGRACIÓN: Banner Hero → Sanity
 *
 * Sube el banner principal del Hero a Sanity para que sea editable desde el Studio.
 *
 * Uso:
 *   node --env-file=.env scripts/migrate-banners-to-sanity.mjs
 */

import { createClient } from '@sanity/client';

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset   = process.env.VITE_SANITY_DATASET    || 'production';
const token     = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌  SANITY_WRITE_TOKEN no configurado.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ─── Banners actuales de la web ───────────────────────────────────────────────
const banners = [
  {
    title: 'Tu Estilo,',
    titleEm: 'Nuestra Pasión',
    eyebrow: 'Jándula Moda — Tienda Online',
    subtitle: 'Moda de mujer con personalidad. Desde Utrera para toda España.',
    buttonText: 'Explorar Tienda',
    buttonLink: '/categoria/todos',
    secondButtonText: 'Contactar',
    secondButtonLink: '/contacto',
    imageAlt: 'Jándula Moda — Nueva temporada',
    // La imagen de fondo actual es de Unsplash — la clienta deberá sustituirla por una propia desde el Studio
    active: true,
    order: 1,
  },
];

async function migrate() {
  console.log(`\n🚀 Migrando ${banners.length} banner(s) a Sanity...\n`);

  const existing = await client.fetch(`*[_type == "banner"]{ _id, title }`);

  if (existing.length > 0) {
    console.log(`⏭  Ya existen ${existing.length} banner(s) en Sanity — omitiendo para no duplicar.`);
    console.log(`   Edítalos directamente en el Studio: https://jandula-moda.sanity.studio/\n`);
    return;
  }

  for (const b of banners) {
    const doc = { _type: 'banner', ...b };
    try {
      const result = await client.create(doc);
      console.log(`✅  Creado: "${b.title} ${b.titleEm}" (${result._id})`);
    } catch (err) {
      console.error(`❌  Error al crear banner:`, err.message);
    }
  }

  console.log(`\n🎉 Listo. Abre el Studio → "Banners" para añadir la imagen de fondo.`);
  console.log(`   https://jandula-moda.sanity.studio/\n`);
}

migrate().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
