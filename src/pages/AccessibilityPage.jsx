import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function AccessibilityPage() {
    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--legal">
                <h1>Accesibilidad</h1>
                <p>Nuestro compromiso con la accesibilidad web universal</p>
            </div>

            <section className="legal-content container">
                <h2>1. Nuestro Compromiso</h2>
                <p>
                    En Jándula Moda creemos firmemente que la moda es para todas las personas, y eso incluye también nuestra experiencia digital. Nos esforzamos para que nuestro sitio web sea accesible para el mayor número posible de usuarios, independientemente de sus capacidades o del dispositivo que utilicen.
                </p>

                <h2>2. Estándares que Seguimos</h2>
                <p>
                    Trabajamos para cumplir con las directrices de accesibilidad al contenido web (WCAG) 2.1, nivel AA, establecidas por el W3C — World Wide Web Consortium. Estas pautas nos ayudan a garantizar que el contenido sea perceptible, operable, comprensible y robusto.
                </p>

                <h2>3. Medidas de Accesibilidad Implementadas</h2>
                <p>Hemos incorporado las siguientes funcionalidades para facilitar tu navegación:</p>
                <ul>
                    <li><strong>Navegación por teclado:</strong> Puedes navegar por toda la web utilizando únicamente el teclado. Todos los elementos interactivos son accesibles mediante la tecla Tab.</li>
                    <li><strong>Etiquetas ARIA:</strong> Utilizamos atributos ARIA (Accessible Rich Internet Applications) para mejorar la compatibilidad con lectores de pantalla.</li>
                    <li><strong>Texto alternativo:</strong> Todas las imágenes de productos incluyen texto descriptivo alternativo para su correcta interpretación por tecnologías de asistencia.</li>
                    <li><strong>Contraste de colores:</strong> Hemos diseñado nuestra paleta de colores para cumplir con las ratios de contraste recomendadas, facilitando la lectura del contenido.</li>
                    <li><strong>Tipografía legible:</strong> Utilizamos fuentes optimizadas para pantalla con tamaños adaptables, asegurando una lectura cómoda en cualquier dispositivo.</li>
                    <li><strong>Diseño responsivo:</strong> Nuestra web se adapta a todos los tamaños de pantalla: móviles, tablets, ordenadores y pantallas de gran formato.</li>
                    <li><strong>Enlace "Ir al contenido":</strong> Funcionalidad de salto al contenido principal para usuarios de teclado y lectores de pantalla.</li>
                </ul>

                <h2>4. Herramientas de Ayuda en tu Navegador</h2>
                <p>
                    La mayoría de navegadores incluyen herramientas que pueden mejorar tu experiencia:
                </p>
                <ul>
                    <li><strong>Zoom del navegador:</strong> Usa Ctrl/Cmd + "+" para aumentar el tamaño del texto, o Ctrl/Cmd + "-" para reducirlo.</li>
                    <li><strong>Modo de alto contraste:</strong> Activa el modo de alto contraste en los ajustes de accesibilidad de tu sistema operativo.</li>
                    <li><strong>Lectores de pantalla:</strong> Nuestra web es compatible con lectores como NVDA, JAWS, VoiceOver y TalkBack.</li>
                </ul>

                <h2>5. Mejora Continua</h2>
                <p>
                    La accesibilidad web es un proceso continuo. Revisamos periódicamente nuestra plataforma para identificar y corregir posibles barreras de acceso. Tu opinión es fundamental para seguir mejorando.
                </p>

                <h2>6. Contacto</h2>
                <p>
                    Si encuentras alguna dificultad para acceder al contenido de nuestra web o tienes sugerencias de mejora, por favor contacta con nosotros:
                </p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a></li>
                    <li><strong>Teléfono:</strong> <a href="tel:+34610505303">610 505 303</a></li>
                </ul>
                <p>
                    Nos comprometemos a responder a cualquier consulta relacionada con la accesibilidad en un plazo máximo de 48 horas laborables.
                </p>

                <div className="legal-back">
                    <Link to="/">← Volver al Inicio</Link>
                </div>
            </section>
        </main>
    );
}
