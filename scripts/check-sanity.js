// Script rápido para verificar cuántos productos hay en Sanity
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'wcz82277',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const count = await client.fetch(`count(*[_type == "product"])`);
console.log(`\n📊 Productos en Sanity: ${count}\n`);

if (count > 0) {
  const sample = await client.fetch(`*[_type == "product"][0..2]{ _id, name, price }`);
  console.log('Muestra:');
  sample.forEach(p => console.log(`  - ${p.name} (${p.price}€) [${p._id}]`));
}
