import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategories, urlFor } from '../lib/sanity';
import '../styles/sections.css';

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
                    : null;

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
