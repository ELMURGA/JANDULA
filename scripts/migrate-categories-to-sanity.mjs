/**
 * 🔄 MIGRACIÓN: Categorías hardcoded → Sanity
 *
 * Sube las categorías existentes de la web a Sanity Studio para que
 * la clienta pueda editarlas y añadir nuevas desde el panel.
 *
 * Uso:
 *   SANITY_WRITE_TOKEN=<token> node scripts/migrate-categories-to-sanity.mjs
 *
 * O con el .env configurado:
 *   node scripts/migrate-categories-to-sanity.mjs
 */

import { createClient } from '@sanity/client';

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset   = process.env.VITE_SANITY_DATASET    || 'production';
const token     = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌  SANITY_WRITE_TOKEN no configurado.');
  console.error('   Obtenlo en: https://manage.sanity.io → tu proyecto → API → Tokens');
  console.error('   Permisos necesarios: Editor');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ─── Categorías actuales de la web ────────────────────────────────────────────
const categories = [
  {
    name: 'Nueva Colección',
    slug: 'nueva-coleccion',
    order: 1,
    active: true,
    subcategories: [],
    showInBlocks: false,
  },
  {
    name: 'Invitada Talla Grande',
    slug: 'invitada-talla-grande',
    order: 2,
    active: true,
    subcategories: [],
    showInBlocks: false,
  },
  {
    name: 'Casual',
    slug: 'casual',
    order: 3,
    active: true,
    subcategories: [
      { name: 'Camisas y Chalecos',   slug: 'casual-camisas-chalecos' },
      { name: 'Camisetas y Tops',     slug: 'casual-camisetas-tops' },
      { name: 'Chaquetas',            slug: 'casual-chaquetas' },
      { name: 'Faldas y Shorts',      slug: 'casual-faldas-shorts' },
      { name: 'Pantalones y Monos',   slug: 'casual-pantalones-monos' },
      { name: 'Total Casual Look',    slug: 'casual-total-look' },
      { name: 'Vestidos',             slug: 'casual-vestidos' },
    ],
    showInBlocks: false,
  },
  {
    name: 'Fiesta',
    slug: 'fiesta',
    order: 4,
    active: true,
    subcategories: [
      { name: 'Conjunto Dos Piezas',    slug: 'fiesta-conjunto-dos-piezas' },
      { name: 'Vestidos Fiesta',        slug: 'fiesta-vestidos' },
      { name: 'Vestidos Largos Fiesta', slug: 'fiesta-vestidos-largos' },
    ],
    showInBlocks: true,
    blockTitle: 'Invitada Perfecta',
    blockDesc:  'Vestidos de fiesta que roban miradas',
    blockCta:   'Descubrir',
  },
  {
    name: 'Complementos',
    slug: 'complementos',
    order: 5,
    active: true,
    subcategories: [
      { name: 'Anillos',    slug: 'complementos-anillos' },
      { name: 'Cinturones', slug: 'complementos-cinturones' },
      { name: 'Collares',   slug: 'complementos-collares' },
      { name: 'Pendientes', slug: 'complementos-pendientes' },
      { name: 'Pulseras',   slug: 'complementos-pulseras' },
      { name: 'Tocados',    slug: 'complementos-tocados' },
    ],
    showInBlocks: true,
    blockTitle: 'Complementos',
    blockDesc:  'El detalle que marca la diferencia',
    blockCta:   'Ver Accesorios',
  },
  {
    name: 'Bolsos',
    slug: 'bolsos',
    order: 6,
    active: true,
    subcategories: [],
    showInBlocks: false,
  },
  {
    name: 'Special Price',
    slug: 'special-price',
    order: 7,
    active: true,
    subcategories: [],
    showInBlocks: false,
  },
];

// ─── Migración ────────────────────────────────────────────────────────────────
async function migrate() {
  console.log(`\n🚀 Migrando ${categories.length} categorías a Sanity...\n`);

  // Comprobar si ya existen categorías para no duplicar
  const existing = await client.fetch(
    `*[_type == "category"]{ _id, "slug": slug.current }`
  );
  const existingSlugs = new Set(existing.map(c => c.slug));

  let created = 0;
  let skipped = 0;

  for (const cat of categories) {
    if (existingSlugs.has(cat.slug)) {
      console.log(`⏭  Omitida (ya existe): ${cat.name}`);
      skipped++;
      continue;
    }

    const doc = {
      _type: 'category',
      name:  cat.name,
      slug:  { _type: 'slug', current: cat.slug },
      order: cat.order,
      active: cat.active,
      subcategories: (cat.subcategories || []).map(s => ({
        _type: 'subcategory',
        _key:  s.slug,
        name:  s.name,
        slug:  s.slug,
      })),
      showInBlocks: cat.showInBlocks ?? false,
      ...(cat.blockTitle && { blockTitle: cat.blockTitle }),
      ...(cat.blockDesc  && { blockDesc:  cat.blockDesc }),
      ...(cat.blockCta   && { blockCta:   cat.blockCta }),
    };

    try {
      const result = await client.create(doc);
      console.log(`✅  Creada: ${cat.name} (${result._id})`);
      created++;
    } catch (err) {
      console.error(`❌  Error al crear "${cat.name}":`, err.message);
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅  Creadas:  ${created}`);
  console.log(`⏭  Omitidas: ${skipped}`);
  console.log(`─────────────────────────────────────`);
  console.log(`\n🎉 Migración completada.`);
  console.log(`   Abre el Studio y edita las categorías en la sección "Categoría"\n`);
}

migrate().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
