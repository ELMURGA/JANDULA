import { useState } from 'react';
import '../styles/sections.css';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
        }
    };

    return (
        <section className="newsletter">
            <div className="container">
                <h2>Únete a nuestro Club</h2>
                <p>
                    Suscríbete y entérate antes que nadie de las nuevas colecciones, ofertas exclusivas
                    y consejos de moda de Jándula Moda Utrera.
                </p>

                {submitted ? (
                    <p style={{ color: 'var(--color-stone-700)', fontWeight: 500, marginTop: '0.5rem' }}>
                        ¡Gracias! Te avisaremos con todas las novedades.
                    </p>
                ) : (
                    <form className="newsletter__form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="newsletter__input"
                            placeholder="Tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="newsletter__submit">
                            Suscribirme
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
