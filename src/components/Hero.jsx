import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBanners, urlFor } from '../lib/sanity';
import '../styles/hero.css';


// Contenido por defecto mientras carga o si Sanity no devuelve nada
const DEFAULT = {
    eyebrow: 'Jándula Moda — Tienda Online',
    title: 'Tu Estilo,',
    titleEm: 'Nuestra Pasión',
    subtitle: 'Moda de mujer con personalidad. Desde Utrera para toda España.',
    buttonText: 'Explorar Tienda',
    buttonLink: '/categoria/todos',
    secondButtonText: 'Contactar',
    secondButtonLink: '/contacto',
    imageUrl: null,
    imageAlt: 'Jándula Moda — Nueva temporada',
};

export default function Hero() {
    const [banner, setBanner] = useState(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        getBanners().then(list => {
            if (list && list.length > 0) setBanner(list[0]);
        });
    }, []);

    const b = banner
        ? {
            eyebrow: banner.eyebrow || DEFAULT.eyebrow,
            title: banner.title || DEFAULT.title,
            titleEm: banner.titleEm || DEFAULT.titleEm,
            subtitle: banner.subtitle || DEFAULT.subtitle,
            buttonText: banner.buttonText || DEFAULT.buttonText,
            buttonLink: banner.buttonLink || DEFAULT.buttonLink,
            secondButtonText: banner.secondButtonText,
            secondButtonLink: banner.secondButtonLink,
            // Imagen principal: 1400px (suficiente para pantallas 2x hasta 700px)
            imageUrl: banner.image ? urlFor(banner.image).width(1400).url() : DEFAULT.imageUrl,
            // LQIP: imagen diminuta (20px) como placeholder borroso mientras carga la principal
            lqipUrl: banner.image ? urlFor(banner.image).width(20).quality(20).url() : null,
            imageAlt: banner.imageAlt || DEFAULT.imageAlt,
        }
        : DEFAULT;

    return (
        <section className="hero" id="inicio">
            {b.imageUrl && (
                // El div wrapper muestra el LQIP borroso hasta que carga la imagen real
                <div
                    className={`hero__bg-wrap${imgLoaded ? ' hero__bg-wrap--loaded' : ''}`}
                    style={b.lqipUrl ? { backgroundImage: `url(${b.lqipUrl})` } : undefined}
                >
                    <img
                        src={b.imageUrl}
                        alt={b.imageAlt}
                        className="hero__bg"
                        loading="eager"
                        fetchPriority="high"
                        onLoad={() => setImgLoaded(true)}
                    />
                </div>
            )}
            <div className="hero__overlay" />

            <div className="hero__content animate-fade-in-up">
                <span className="hero__eyebrow">{b.eyebrow}</span>
                <h2 className="hero__title">
                    {b.title}<br />
                    {b.titleEm && <em>{b.titleEm}</em>}
                </h2>
                {b.subtitle && <p className="hero__subtitle">{b.subtitle}</p>}
                <div className="hero__actions">
                    <Link to={b.buttonLink} className="hero__cta">
                        {b.buttonText} <ArrowRight size={16} />
                    </Link>
                    {b.secondButtonText && b.secondButtonLink && (
                        <Link to={b.secondButtonLink} className="hero__cta hero__cta--secondary">
                            {b.secondButtonText}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
