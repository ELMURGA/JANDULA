import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategories, urlFor } from '../lib/sanity';
import '../styles/sections.css';

// Imágenes de reserva por slug hasta que la clienta suba fotos reales en el Studio
const FALLBACK_IMAGES = {
    'fiesta':       'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
    'complementos': 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=1000',
};

export default function CategoryBlocks() {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        getCategories().then(cats => {
            setBlocks(cats.filter(c => c.showInBlocks));
        });
    }, []);

    if (blocks.length === 0) return null;

    return (
        <section className="category-blocks" id="fiesta">
            {blocks.map((block) => {
                const imageUrl = block.coverImage
                    ? urlFor(block.coverImage).width(1000).url()
                    : FALLBACK_IMAGES[block.slug] || null;

                return (
                    <Link key={block.slug} to={`/categoria/${block.slug}`} className="category-block">
                        {imageUrl && (
                            <img src={imageUrl} alt={block.blockTitle || block.name} className="category-block__img" loading="lazy" />
                        )}
                        <div className="category-block__overlay">
                            <div className="category-block__label">
                                <h3>{block.blockTitle || block.name}</h3>
                                {block.blockDesc && <p className="category-block__desc">{block.blockDesc}</p>}
                                <span className="category-block__cta">
                                    {block.blockCta || 'Ver colección'} <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </section>
    );
}
