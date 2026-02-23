import { products, CATEGORIES, formatPrice } from '../data/products';
import ProductCard from './ProductCard';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/products.css';

export default function ProductGrid() {
    const [activeCategory, setActiveCategory] = useState('Todos');

    // Show best sellers (non-sale items)
    const bestSellers = products.filter(p => !p.originalPrice);

    const filtered = activeCategory === 'Todos'
        ? bestSellers.slice(0, 8)
        : bestSellers.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory)).slice(0, 8);

    const filterCategories = ['Todos', 'Casual', 'Fiesta', 'Complementos', 'Bolsos'];

    return (
        <section className="products-section" id="coleccion">
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow" style={{ color: 'var(--color-brand-pink)' }}>LO MEJOR DE JÁNDULA</span>
                    <h2>Los Más Destacados</h2>
                    <p>
                        Prendas seleccionadas con gusto exquisito para que luzcas espectacular en cada momento de tu vida.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="category-filters">
                    {filterCategories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="products-grid">
                    {filtered.length > 0
                        ? filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))
                        : (
                            <p className="products-empty">
                                No se encontraron productos en esta categoría.
                            </p>
                        )
                    }
                </div>

                <div className="load-more-wrap">
                    <Link to="/categoria/todos" className="btn-outline">Ver Toda la Tienda</Link>
                </div>
            </div>
        </section>
    );
}
