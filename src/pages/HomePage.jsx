import Hero from '../components/Hero';
import ValueProps from '../components/ValueProps';
import ProductGrid from '../components/ProductGrid';
import CategoryBlocks from '../components/CategoryBlocks';
import SaleGrid from '../components/SaleGrid';

export default function HomePage() {
    return (
        <main>
            <Hero />
            <ValueProps />
            <ProductGrid />
            <CategoryBlocks />
            <SaleGrid />
        </main>
    );
}
