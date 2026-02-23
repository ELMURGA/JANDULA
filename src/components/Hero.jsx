import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';

export default function Hero() {
    return (
        <section className="hero" id="inicio">
            <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
                alt="Jándula Moda — Nueva temporada"
                className="hero__bg"
                loading="eager"
                fetchPriority="high"
            />
            <div className="hero__overlay" />

            <div className="hero__content animate-fade-in-up">
                <span className="hero__eyebrow">Jándula Moda — Tienda Online</span>
                <h2 className="hero__title">
                    Tu Estilo,<br />
                    <em>Nuestra Pasión</em>
                </h2>
                <p className="hero__subtitle">Moda de mujer con personalidad. Desde Utrera para toda España.</p>
                <div className="hero__actions">
                    <Link to="/categoria/todos" className="hero__cta">
                        Explorar Tienda <ArrowRight size={16} />
                    </Link>
                    <Link to="/contacto" className="hero__cta hero__cta--secondary">
                        Contactar
                    </Link>
                </div>
            </div>
        </section>
    );
}
