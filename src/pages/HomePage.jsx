import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import ProductGrid from '../components/ProductGrid';
import CategoryBlocks from '../components/CategoryBlocks';
import SaleGrid from '../components/SaleGrid';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
    return (
        <main>
            <Hero />
            <ValueProps />
            <ProductGrid />
            <CategoryBlocks />
            <SaleGrid />
            <Newsletter />
        </main>
    );
}
