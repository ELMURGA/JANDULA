// Utilidades de producto para el frontend
import { urlFor } from '../lib/sanity';

export function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Genera la URL de imagen del producto desde Sanity CDN.
 * - Calidad 100 (sin pérdida)
 * - WebP automático si el navegador lo soporta
 * - width configurable
 */
export function getImageUrl(image, width = 600) {
  if (typeof image === 'string') return image;
  if (!image?.asset) return '/placeholder.jpg';
  return urlFor(image).width(width).url();
}

// Normaliza un producto de Sanity al formato compatible con los componentes
export function normalizeProduct(sanityProduct) {
  if (!sanityProduct) return null;

  const isAlreadyNormalized =
    typeof sanityProduct.slug === 'string' &&
    typeof sanityProduct.image === 'string' &&
    Number.isFinite(sanityProduct.id);

  if (isAlreadyNormalized) {
    return {
      ...sanityProduct,
      originalPrice: sanityProduct.originalPrice || null,
      tags: sanityProduct.tags || [],
      gallery: sanityProduct.gallery || [],
      sizes: sanityProduct.sizes || [],
      colors: sanityProduct.colors || [],
      image: sanityProduct.image || '/placeholder.jpg',
      imageHD: sanityProduct.imageHD || sanityProduct.image || '/placeholder.jpg',
      slug: sanityProduct.slug || '',
    };
  }

  // Extraer ID numérico de "_id" (formato: "product-42" → 42)
  // Necesario para que el carrito referencie correctamente la tabla products de Supabase
  const numericId = Number.isFinite(sanityProduct.id)
    ? sanityProduct.id
    : parseInt(sanityProduct._id?.replace('product-', '') || '0', 10);

  return {
    _id: sanityProduct._id,
    id: numericId,
    name: sanityProduct.name,
    price: sanityProduct.price,
    originalPrice: sanityProduct.originalPrice || null,
    category: Array.isArray(sanityProduct.category)
      ? sanityProduct.category
      : sanityProduct.category ? [sanityProduct.category] : [],
    subcategory: Array.isArray(sanityProduct.subcategory)
      ? sanityProduct.subcategory
      : sanityProduct.subcategory ? [sanityProduct.subcategory] : [],
    tags: sanityProduct.tags || [],
    // Imagen para cards: 500px cubre hasta 250px@2x DPR
    image: getImageUrl(sanityProduct.image, 500),
    // Imagen para página de detalle: 900px cubre hasta 450px@2x DPR
    imageHD: getImageUrl(sanityProduct.image, 900),
    // Galería de imágenes adicionales
    gallery: sanityProduct.gallery?.map(img => getImageUrl(img, 900)) || [],
    // Objeto imagen original (por si se necesita para srcset)
    rawImage: sanityProduct.image || null,
    description: sanityProduct.description,
    sizes: sanityProduct.sizes || [],
    colors: sanityProduct.colors || [],
    // Variantes por color: [{ color: string, sizes: string[] }]
    variants: sanityProduct.variants || [],
    // Producto agotado
    outOfStock: sanityProduct.outOfStock || false,
    active: sanityProduct.active !== false,
    featured: sanityProduct.featured || false,
    slug: sanityProduct.slug?.current || '',
  };
}
