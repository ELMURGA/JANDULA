import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import ProductGrid from '../components/ProductGrid';
import CategoryBlocks from '../components/CategoryBlocks';
import SaleGrid from '../components/SaleGrid';
import SEOHead from '../components/SEOHead';

const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jándula Moda',
    url: 'https://jandulamodautrera.es',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jandulamodautrera.es/categoria/todos?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};

export default function HomePage() {
    return (
        <main>
            <SEOHead
                title="Moda de Mujer en Utrera, Sevilla"
                description="Jándula Moda — Tu tienda de moda de mujer en Utrera, Sevilla. Vestidos de fiesta, ropa casual, complementos y más. Envíos a toda España."
                canonical="/"
                jsonLd={homeJsonLd}
            />
            <Hero />
            <ValueProps />
            <ProductGrid />
            <CategoryBlocks />
            <SaleGrid />
        </main>
    );
}
