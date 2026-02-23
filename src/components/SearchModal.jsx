import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, formatPrice } from '../data/products';
import '../styles/search-modal.css';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase().trim();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
        setResults(filtered.slice(0, 8));
    }, [query]);

    if (!isOpen) return null;

    return (
        <>
            <div className="search-overlay" onClick={onClose} />
            <div className="search-modal">
                <div className="search-modal__header">
                    <div className="search-modal__input-wrap">
                        <Search size={20} className="search-modal__icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Buscar productos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-modal__input"
                        />
                        {query && (
                            <button className="search-modal__clear" onClick={() => setQuery('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button className="search-modal__close" onClick={onClose}>
                        Cerrar
                    </button>
                </div>

                <div className="search-modal__body">
                    {query.trim().length < 2 ? (
                        <div className="search-modal__hint">
                            <Search size={48} strokeWidth={1} />
                            <p>Escribe al menos 2 caracteres para buscar</p>
                            <div className="search-modal__popular">
                                <span className="search-modal__popular-label">Búsquedas populares:</span>
                                <div className="search-modal__popular-tags">
                                    {['Vestido', 'Bolso', 'Conjunto', 'Fiesta', 'Collar'].map(term => (
                                        <button key={term} className="search-modal__tag" onClick={() => setQuery(term)}>
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="search-modal__empty">
                            <p>No se encontraron productos para <strong>"{query}"</strong></p>
                            <span>Prueba con otra búsqueda o explora nuestras categorías</span>
                        </div>
                    ) : (
                        <>
                            <p className="search-modal__count">
                                {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
                            </p>
                            <div className="search-modal__results">
                                {results.map(product => (
                                    <Link
                                        key={product.id}
                                        to={`/producto/${product.id}`}
                                        className="search-result"
                                        onClick={onClose}
                                    >
                                        <div className="search-result__image-wrap">
                                            <img src={product.image} alt={product.name} className="search-result__image" />
                                        </div>
                                        <div className="search-result__info">
                                            <span className="search-result__category">{product.category}</span>
                                            <h4 className="search-result__name">{product.name}</h4>
                                            <div className="search-result__prices">
                                                <span className="search-result__price">{formatPrice(product.price)}</span>
                                                {product.originalPrice && (
                                                    <span className="search-result__original">{formatPrice(product.originalPrice)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link to="/categoria/todos" className="search-modal__see-all" onClick={onClose}>
                                Ver todos los productos →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
