import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, CATEGORIES, SUBCATEGORIES, formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';
import { Filter, ChevronRight } from 'lucide-react';
import '../styles/pages.css';

export default function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('default');

    const handleCategorySelect = (e) => {
        navigate(`/categoria/${e.target.value}`);
    };

    const handleSubcategorySelect = (e) => {
        navigate(`/categoria/${e.target.value}`);
    };

    const categoryMap = {
        'nueva-coleccion': 'Nueva Colección',
        'invitada-talla-grande': 'Invitada Talla Grande',
        'casual': 'Casual',
        'fiesta': 'Fiesta',
        'complementos': 'Complementos',
        'bolsos': 'Bolsos',
        'special-price': 'Special Price',
    };

    // Determine the parent category slug for subcategory lookup
    const parentCategorySlug = Object.keys(categoryMap).find(key => key === slug);

    // Check if slug is a subcategory
    const isSubcategory = slug && !categoryMap[slug] && slug !== 'todos';
    let categoryName = categoryMap[slug] || 'Todos';
    let subcategoryName = null;
    let parentSlug = null;

    if (isSubcategory) {
        for (const [parentKey, subs] of Object.entries(SUBCATEGORIES)) {
            const found = subs.find(s => s.slug === slug);
            if (found) {
                subcategoryName = found.name;
                parentSlug = parentKey;
                categoryName = categoryMap[parentKey] || parentKey;
                break;
            }
        }
    }

    const isAll = !slug || slug === 'todos';

    // Get subcategories for the current main category (or parent if viewing subcategory)
    const currentCategorySlug = isSubcategory ? parentSlug : parentCategorySlug;
    const subcategories = currentCategorySlug ? SUBCATEGORIES[currentCategorySlug] || [] : [];

    // Filter products
    let filtered;
    if (isAll) {
        filtered = products;
    } else if (isSubcategory && subcategoryName) {
        filtered = products.filter(p => p.subcategory === slug);
    } else if (categoryName === 'Special Price') {
        filtered = products.filter(p => p.tags.includes('Special Price'));
    } else {
        filtered = products.filter(p =>
            p.category === categoryName || p.tags.includes(categoryName)
        );
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

    const displayName = subcategoryName || (isAll ? 'Toda la Colección' : categoryName);

    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--category">
                <h1>{displayName}</h1>
                <p>{sorted.length} producto{sorted.length !== 1 && 's'}</p>
            </div>

            <section className="category-page container">
                {/* Main Category Tabs */}
                <div className="category-toolbar">
                    {/* Selector de categoría para móvil */}
                    <div className="category-select-mobile">
                        <select
                            value={isSubcategory ? parentSlug : (isAll ? 'todos' : slug)}
                            onChange={handleCategorySelect}
                            aria-label="Seleccionar categoría"
                        >
                            <option value="todos">Todos</option>
                            {Object.entries(categoryMap).map(([s, name]) => (
                                <option key={s} value={s}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="category-tags">
                        <Link to="/categoria/todos" className={`cat-tag ${isAll ? 'active' : ''}`}>Todos</Link>
                        {Object.entries(categoryMap).map(([s, name]) => (
                            <Link key={s} to={`/categoria/${s}`} className={`cat-tag ${slug === s || (isSubcategory && parentSlug === s) ? 'active' : ''}`}>
                                {name}
                            </Link>
                        ))}
                    </div>
                    <div className="category-sort">
                        <Filter size={16} />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="default">Ordenar por</option>
                            <option value="price-asc">Precio: menor a mayor</option>
                            <option value="price-desc">Precio: mayor a menor</option>
                            <option value="name">Nombre A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Subcategory Tabs — shown when on a main category that has subcategories */}
                {subcategories.length > 0 && (
                    <>
                    {/* Selector de subcategoría para móvil */}
                    <div className="subcategory-select-mobile">
                        <select
                            value={isSubcategory ? slug : currentCategorySlug}
                            onChange={handleSubcategorySelect}
                            aria-label="Seleccionar subcategoría"
                        >
                            <option value={currentCategorySlug}>Todo {categoryName}</option>
                            {subcategories.map(sub => (
                                <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="subcategory-tabs">
                        <Link
                            to={`/categoria/${currentCategorySlug}`}
                            className={`subcat-tab ${!isSubcategory ? 'active' : ''}`}
                        >
                            Todo {categoryName}
                        </Link>
                        {subcategories.map(sub => (
                            <Link
                                key={sub.slug}
                                to={`/categoria/${sub.slug}`}
                                className={`subcat-tab ${slug === sub.slug ? 'active' : ''}`}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                    </>
                )}

                <div className="category-grid">
                    {sorted.length > 0 ? (
                        sorted.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p className="products-empty">No se encontraron productos en esta categoría.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
