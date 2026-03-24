import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../lib/sanity';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import '../styles/pages.css';

export default function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('default');
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const [products, cats] = await Promise.all([getProducts(), getCategories()]);
                setAllProducts(products);
                setCategories(cats);
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleCategorySelect = (e) => {
        navigate(`/categoria/${e.target.value}`);
    };

    const isAll = !slug || slug === 'todos';

    // Buscar el nombre de la categoría actual desde Sanity
    // También incluir subcategorías para hacer el matching
    const allCatSlugs = categories.flatMap(c => [
        { slug: c.slug, name: c.name },
        ...(c.subcategories || []).map(s => ({ slug: s.slug, name: s.name })),
    ]);
    const currentCat = allCatSlugs.find(c => c.slug === slug);
    const categoryName = currentCat?.name || (isAll ? '' : slug);

    // Filtrar productos
    let filtered = allProducts;
    if (!isAll) {
        filtered = allProducts.filter(p =>
            (p.category || []).includes(categoryName) ||
            (p.subcategory || []).includes(slug) ||
            (p.tags && p.tags.includes(categoryName))
        );
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

    // Detectar si el slug actual es una subcategoría y cuál es su categoría padre
    const parentCat = categories.find(c =>
        (c.subcategories || []).some(s => s.slug === slug)
    );

    // Subcategorías a mostrar: las de la categoría activa o la del padre si estamos en una subcat
    const activeCat = categories.find(c => c.slug === slug);
    const subcatsToShow = (activeCat || parentCat)?.subcategories || [];

    const displayName = isAll ? 'Toda la Colección' : (categoryName || slug);

    const seoDescription = isAll
        ? 'Explora toda la colección de Jándula Moda: vestidos de fiesta, ropa casual, complementos y más. Envío a toda España.'
        : `Compra ${displayName} en Jándula Moda, Utrera. ${sorted.length} ${sorted.length === 1 ? 'producto disponible' : 'productos disponibles'}. Envío a toda España.`;

    return (
        <main className="page-wrapper">
            <SEOHead
                title={displayName}
                description={seoDescription}
                canonical={`/categoria/${isAll ? 'todos' : slug}`}
            />
            <div className="page-hero page-hero--category">
                <h1>{displayName}</h1>
                {!loading && <p>{sorted.length} producto{sorted.length !== 1 && 's'}</p>}
            </div>

            <section className="category-page container">
                {/* Main Category Toolbar */}
                <div className="category-toolbar">
                    {/* Selector de categoría para móvil */}
                    <div className="category-select-mobile">
                        <select
                            value={isAll ? 'todos' : slug}
                            onChange={handleCategorySelect}
                            aria-label="Seleccionar categoría"
                        >
                            <option value="todos">Todos</option>
                            {categories.map(cat => (
                                <optgroup key={cat.slug} label={cat.name}>
                                    <option value={cat.slug}>{cat.name} — Todo</option>
                                    {(cat.subcategories || []).map(s => (
                                        <option key={s.slug} value={s.slug}>↳ {s.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="category-tags" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        {/* Fila de categorías principales */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <Link to="/categoria/todos" className={`cat-tag ${isAll ? 'active' : ''}`}>Todos</Link>
                            {categories.map(cat => (
                                <Link key={cat.slug} to={`/categoria/${cat.slug}`} className={`cat-tag ${slug === cat.slug || parentCat?.slug === cat.slug ? 'active' : ''}`}>
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                        {/* Fila de subcategorías si la categoría activa tiene */}
                        {subcatsToShow.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingLeft: '0.25rem' }}>
                                {subcatsToShow.map(sub => (
                                    <Link
                                        key={sub.slug}
                                        to={`/categoria/${sub.slug}`}
                                        className={`cat-tag cat-tag--sub ${slug === sub.slug ? 'active' : ''}`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        )}
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

                {/* Grid de productos */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p style={{ color: 'var(--color-stone-500)' }}>Cargando productos...</p>
                    </div>
                ) : (
                    <div className="category-grid">
                        {sorted.length > 0 ? (
                            sorted.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <p className="products-empty">No se encontraron productos en esta categoría.</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
