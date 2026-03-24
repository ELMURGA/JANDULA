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
export function getImageUrl(image, width = 800) {
  if (typeof image === 'string') return image;
  if (!image?.asset) return '/placeholder.jpg';
  // Eliminamos width fijo para que no haya reescalado o forzamos máximo
  return urlFor(image).url();
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
    // Imagen en alta calidad (95%) y ancho 800px para cards
    image: getImageUrl(sanityProduct.image, 800),
    // Imagen en máxima calidad para página de detalle
    imageHD: getImageUrl(sanityProduct.image, 1200),
    // Galería de imágenes adicionales
    gallery: sanityProduct.gallery?.map(img => getImageUrl(img, 1200)) || [],
    // Objeto imagen original (por si se necesita para srcset)
    rawImage: sanityProduct.image || null,
    description: sanityProduct.description,
    sizes: sanityProduct.sizes || [],
    colors: sanityProduct.colors || [],
    active: sanityProduct.active !== false,
    featured: sanityProduct.featured || false,
    slug: sanityProduct.slug?.current || '',
  };
}
