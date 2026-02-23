import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/sections.css';

const blocks = [
    {
        id: 'invitada',
        title: 'Invitada Perfecta',
        desc: 'Vestidos de fiesta que roban miradas',
        cta: 'Descubrir',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
        alt: 'Colección invitada perfecta',
        to: '/categoria/fiesta',
    },
    {
        id: 'complementos',
        title: 'Complementos',
        desc: 'El detalle que marca la diferencia',
        cta: 'Ver Accesorios',
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=1000',
        alt: 'Complementos y accesorios',
        to: '/categoria/complementos',
    },
];

export default function CategoryBlocks() {
    return (
        <section className="category-blocks" id="fiesta">
            {blocks.map((block) => (
                <Link key={block.id} to={block.to} className="category-block">
                    <img src={block.image} alt={block.alt} className="category-block__img" loading="lazy" />
                    <div className="category-block__overlay">
                        <div className="category-block__label">
                            <h3>{block.title}</h3>
                            <p className="category-block__desc">{block.desc}</p>
                            <span className="category-block__cta">
                                {block.cta} <ArrowRight size={16} />
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </section>
    );
}
