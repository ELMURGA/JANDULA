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

  // Si ya fue normalizado (id es string Sanity, slug e imagen ya son strings)
  const isAlreadyNormalized =
    typeof sanityProduct.slug === 'string' &&
    typeof sanityProduct.image === 'string' &&
    typeof sanityProduct.id === 'string' &&
    !!sanityProduct.id;

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

  // Usamos el _id de Sanity directamente como identificador único del producto.
  // Anteriormente se extraía un número de "_id" con formato "product-NNN",
  // pero los nuevos productos tienen _id aleatorio, lo que causaba id=NaN.
  const productId = sanityProduct._id || sanityProduct.id || '';

  return {
    _id: sanityProduct._id,
    id: productId,   // string (Sanity _id), compatible con todos los contextos
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
    // Variantes por color: [{ color: string, colorHex?: string, sizes: string[] }]
    variants: sanityProduct.variants || [],
    // Producto agotado
    outOfStock: sanityProduct.outOfStock || false,
    active: sanityProduct.active !== false,
    featured: sanityProduct.featured || false,
    slug: sanityProduct.slug?.current || '',
  };
}
