import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Jándula Moda';
const DOMAIN = 'https://jandulamodautrera.es';
const DEFAULT_IMG = `${DOMAIN}/images/og-cover.jpg`;

/**
 * SEOHead — gestión centralizada de meta tags SEO.
 *
 * Props:
 *  title        string  — título de la página (sin el sufijo de la tienda)
 *  description  string  — descripción meta (150-160 chars idealmente)
 *  canonical    string  — ruta relativa, p.ej. "/categoria/vestidos"
 *  image        string  — URL absoluta de la imagen OG (opcional)
 *  noindex      bool    — true para páginas privadas/sin valor SEO
 *  type         string  — og:type ("website" | "product" | "article")
 *  jsonLd       object  — datos estructurados JSON-LD (se serializa automáticamente)
 */
export default function SEOHead({
    title,
    description,
    canonical,
    image,
    noindex = false,
    type = 'website',
    jsonLd,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Moda de Mujer en Utrera`;
    const ogImage = image || DEFAULT_IMG;
    const canonicalUrl = canonical ? `${DOMAIN}${canonical}` : null;

    return (
        <Helmet>
            {/* Básicos */}
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
            {noindex
                ? <meta name="robots" content="noindex, nofollow" />
                : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            }
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:type" content={type} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:locale" content="es_ES" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
