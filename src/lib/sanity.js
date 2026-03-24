import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'wcz82277';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Builder de URLs de imágenes con Sanity CDN
const builder = imageUrlBuilder(sanity);

/**
 * Genera URL de imagen optimizada desde Sanity.
 * - calidad 100 para no perder calidad visible respecto al original
 * - WebP automático si el navegador lo soporta
 * - Ancho configurable
 *
 * Ejemplo de uso:
 *   urlFor(product.image).width(600).url()
 *   urlFor(product.image).width(1200).url()  ← para detalle
 */
export function urlFor(source) {
  return builder.image(source).auto('format').quality(100);
}

// Normaliza category y subcategory a siempre ser arrays
// (compatibilidad con documentos antiguos que tenían string)
function normalizeCatArrays(p) {
  return {
    ...p,
    category: Array.isArray(p.category)
      ? p.category
      : p.category ? [p.category] : [],
    subcategory: Array.isArray(p.subcategory)
      ? p.subcategory
      : p.subcategory ? [p.subcategory] : [],
  };
}

// Función helper para obtener productos
export async function getProducts() {
  const query = `*[_type == "product" && active == true] {
    _id,
    name,
    slug,
    price,
    originalPrice,
    category,
    subcategory,
    tags,
    image,
    gallery,
    description,
    sizes,
    colors,
    active,
    featured
  } | order(_createdAt desc)`;

  try {
    const products = await sanity.fetch(query);
    return products.map(normalizeCatArrays);
  } catch (error) {
    console.error('Error fetching products from Sanity:', error);
    return [];
  }
}

// Obtener un producto por slug o _id
export async function getProduct(idOrSlug) {
  const query = `*[_type == "product" && (slug.current == $slug || _id == $id)][0] {
    _id,
    name,
    slug,
    price,
    originalPrice,
    category,
    subcategory,
    tags,
    image,
    gallery,
    description,
    sizes,
    colors,
    active,
    featured
  }`;

  try {
    const product = await sanity.fetch(query, { slug: idOrSlug, id: idOrSlug });
    return product ? normalizeCatArrays(product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  const query = `*[_type == "product" && active == true && category == $category] {
    _id,
    name,
    slug,
    price,
    originalPrice,
    category,
    tags,
    image,
    description,
    sizes,
    colors
  } | order(_createdAt desc)`;

  try {
    return await sanity.fetch(query, { category });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Obtener categorías desde los documentos de Sanity (editables en el Studio)
export async function getCategories() {
  const query = `*[_type == "category" && active == true] {
    _id,
    name,
    "slug": slug.current,
    description,
    coverImage,
    order,
    subcategories,
    showInBlocks,
    blockTitle,
    blockDesc,
    blockCta,
  } | order(order asc)`;

  try {
    return await sanity.fetch(query);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Obtener banners activos desde Sanity (editables en el Studio)
export async function getBanners() {
  const query = `*[_type == "banner" && active == true] {
    _id,
    eyebrow,
    title,
    titleEm,
    subtitle,
    image,
    imageAlt,
    buttonText,
    buttonLink,
    secondButtonText,
    secondButtonLink,
    order,
  } | order(order asc)`;

  try {
    return await sanity.fetch(query);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}
