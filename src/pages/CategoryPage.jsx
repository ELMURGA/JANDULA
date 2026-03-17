import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../lib/sanity';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import '../styles/pages.css';

export default function CategoryPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('default');
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos y categorías desde Sanity
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const products = await getProducts();

                setAllProducts(products);
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

    // Crear mapa de categorías para slugs (similar al anterior)
    const categoryMap = {
        'nueva-coleccion': 'Nueva Colección',
        'invitada-talla-grande': 'Invitada Talla Grande',
        'casual': 'Casual',
        'fiesta': 'Fiesta',
        'complementos': 'Complementos',
        'bolsos': 'Bolsos',
        'special-price': 'Special Price',
    };

    const isAll = !slug || slug === 'todos';
    const categoryName = categoryMap[slug] || 'Todos';

    // Filtrar productos
    let filtered = allProducts;
    if (!isAll && categoryName !== 'Todos') {
        filtered = allProducts.filter(p =>
            p.category === categoryName || (p.tags && p.tags.includes(categoryName))
        );
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));

    const displayName = isAll ? 'Toda la Colección' : categoryName;

    return (
        <main className="page-wrapper">
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
                            {Object.entries(categoryMap).map(([s, name]) => (
                                <option key={s} value={s}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="category-tags">
                        <Link to="/categoria/todos" className={`cat-tag ${isAll ? 'active' : ''}`}>Todos</Link>
                        {Object.entries(categoryMap).map(([s, name]) => (
                            <Link key={s} to={`/categoria/${s}`} className={`cat-tag ${slug === s ? 'active' : ''}`}>
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
