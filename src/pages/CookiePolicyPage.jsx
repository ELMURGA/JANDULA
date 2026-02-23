import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function CookiePolicyPage() {
    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--legal">
                <h1>Política de Cookies</h1>
                <p>Última actualización: febrero 2026</p>
            </div>

            <section className="legal-content container">
                <h2>1. ¿Qué Son las Cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, smartphone o tablet) cuando visitas un sitio web. Estas herramientas nos permiten reconocer tu navegador y recordar cierta información para mejorar tu experiencia de compra en Jándula Moda.
                </p>

                <h2>2. ¿Qué Tipos de Cookies Utilizamos?</h2>

                <h3>2.1. Cookies Técnicas (Esenciales)</h3>
                <p>
                    Son imprescindibles para el correcto funcionamiento de nuestra tienda online. Incluyen cookies de sesión, del carrito de compra y de seguridad. Sin ellas, no sería posible completar un pedido ni navegar correctamente por la web.
                </p>

                <h3>2.2. Cookies de Análisis</h3>
                <p>
                    Utilizamos <strong>Google Analytics</strong> para recopilar datos estadísticos de forma anónima sobre el uso de nuestra web. Esto nos ayuda a entender cómo navegas, qué páginas visitas con más frecuencia y cómo podemos mejorar tu experiencia. Estas cookies no recopilan información que permita identificarte personalmente.
                </p>

                <h3>2.3. Cookies de Personalización</h3>
                <p>
                    Nos permiten recordar tus preferencias (como el idioma o la región) para ofrecerte una experiencia más personalizada y relevante cada vez que nos visitas.
                </p>

                <h3>2.4. Cookies Publicitarias</h3>
                <p>
                    Son utilizadas para mostrarte publicidad relevante en función de tus intereses. Pueden ser establecidas por terceros como plataformas de redes sociales (Facebook, Instagram) para personalizar los anuncios que ves fuera de nuestro sitio web.
                </p>

                <h2>3. Cuadro Resumen de Cookies</h2>
                <div className="cookie-table-wrap">
                    <table className="cookie-table">
                        <thead>
                            <tr>
                                <th>Cookie</th>
                                <th>Tipo</th>
                                <th>Duración</th>
                                <th>Finalidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>_session_id</td>
                                <td>Técnica</td>
                                <td>Sesión</td>
                                <td>Mantener la sesión de usuario activa</td>
                            </tr>
                            <tr>
                                <td>cart_token</td>
                                <td>Técnica</td>
                                <td>14 días</td>
                                <td>Mantener los productos del carrito de compra</td>
                            </tr>
                            <tr>
                                <td>_ga / _gid</td>
                                <td>Análisis</td>
                                <td>2 años / 24h</td>
                                <td>Google Analytics: distinguir usuarios y sesiones</td>
                            </tr>
                            <tr>
                                <td>_fbp</td>
                                <td>Publicitaria</td>
                                <td>3 meses</td>
                                <td>Facebook Pixel: personalizar anuncios</td>
                            </tr>
                            <tr>
                                <td>cookie_consent</td>
                                <td>Técnica</td>
                                <td>1 año</td>
                                <td>Recordar tus preferencias de cookies</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>4. ¿Cómo Gestionar las Cookies?</h2>
                <p>
                    Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Te indicamos cómo hacerlo en los principales navegadores:
                </p>
                <ul>
                    <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
                    <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
                    <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
                    <li><strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio</li>
                </ul>
                <p>
                    Ten en cuenta que el bloqueo de cookies esenciales puede impedir el correcto funcionamiento de algunas áreas de nuestro sitio web, como el proceso de compra.
                </p>

                <h2>5. Consentimiento</h2>
                <p>
                    Al acceder a nuestra web por primera vez, te mostramos un banner informativo donde puedes aceptar o rechazar el uso de cookies no esenciales. Puedes modificar tus preferencias en cualquier momento desde esta misma página.
                </p>

                <h2>6. Contacto</h2>
                <p>
                    Si tienes alguna duda sobre nuestra política de cookies, no dudes en contactarnos en{' '}
                    <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a>.
                </p>

                <div className="legal-back">
                    <Link to="/">← Volver al Inicio</Link>
                </div>
            </section>
        </main>
    );
}
