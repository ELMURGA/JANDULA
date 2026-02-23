import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function PrivacyPolicyPage() {
    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--legal">
                <h1>Política de Privacidad</h1>
                <p>Última actualización: febrero 2026</p>
            </div>

            <section className="legal-content container">
                <h2>1. Responsable del Tratamiento</h2>
                <div className="legal-info-box">
                    <p><strong>Responsable:</strong> Isabel Beatriz Lobato Galante</p>
                    <p><strong>CIF:</strong> 49025991L</p>
                    <p><strong>Domicilio:</strong> C/ María Auxiliadora, 76 — 41710 Utrera, Sevilla (España)</p>
                    <p><strong>Email:</strong> <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a></p>
                    <p><strong>Teléfono:</strong> <a href="tel:+34610505303">610 505 303</a></p>
                </div>

                <h2>2. Finalidad del Tratamiento de Datos</h2>
                <p>
                    En Jándula Moda recopilamos y tratamos los datos personales que nos facilitas con las siguientes finalidades:
                </p>
                <ul>
                    <li><strong>Gestión de pedidos:</strong> Procesar tus compras, gestionar los envíos y administrar las devoluciones de productos adquiridos a través de nuestra tienda online.</li>
                    <li><strong>Atención al cliente:</strong> Resolver tus consultas, reclamaciones o solicitudes de información a través de nuestros canales de contacto (teléfono, email y WhatsApp).</li>
                    <li><strong>Comunicaciones comerciales:</strong> Si nos das tu consentimiento expreso, enviarte información sobre novedades, promociones y ofertas especiales de nuestra tienda.</li>
                    <li><strong>Gestión de la cuenta de usuario:</strong> Administrar tu registro en nuestra web para facilitarte futuras compras y el acceso a tu historial de pedidos.</li>
                    <li><strong>Cumplimiento legal:</strong> Atender las obligaciones legales y fiscales derivadas de la actividad comercial.</li>
                </ul>

                <h2>3. Datos Personales Recopilados</h2>
                <p>Los datos identificativos que podemos recopilar incluyen:</p>
                <ul>
                    <li>Nombre y apellidos</li>
                    <li>Dirección postal de envío y facturación</li>
                    <li>Correo electrónico</li>
                    <li>Número de teléfono</li>
                    <li>Datos de pago (procesados de forma segura por pasarelas de pago certificadas)</li>
                    <li>Dirección IP y datos de navegación</li>
                </ul>

                <h2>4. Legitimación del Tratamiento</h2>
                <p>La base legal para el tratamiento de tus datos se fundamenta en:</p>
                <ul>
                    <li><strong>Ejecución de un contrato:</strong> Para el procesamiento de pedidos y la prestación del servicio de venta online.</li>
                    <li><strong>Consentimiento del interesado:</strong> Para el envío de comunicaciones comerciales y newsletters.</li>
                    <li><strong>Interés legítimo:</strong> Para la detección y prevención de fraudes, así como la mejora de nuestros servicios.</li>
                    <li><strong>Obligación legal:</strong> Para el cumplimiento de las normativas fiscales y mercantiles vigentes.</li>
                </ul>

                <h2>5. Destinatarios de los Datos</h2>
                <p>
                    Tus datos personales podrán ser comunicados a los siguientes destinatarios:
                </p>
                <ul>
                    <li>Empresas de transporte y mensajería para la entrega de paquetes.</li>
                    <li>Entidades financieras y pasarelas de pago para el procesamiento seguro de transacciones.</li>
                    <li>Administraciones públicas cuando exista obligación legal.</li>
                    <li>Proveedores de servicios tecnológicos (hosting, email marketing) que actúan como encargados del tratamiento.</li>
                </ul>
                <p>En ningún caso cederemos tus datos a terceros con fines comerciales sin tu consentimiento explícito.</p>

                <h2>6. Conservación de los Datos</h2>
                <p>
                    Los datos personales se conservarán mientras dure la relación comercial y, una vez finalizada, durante los plazos legalmente establecidos para atender posibles responsabilidades. Los datos facilitados para comunicaciones comerciales se conservarán hasta que solicites la baja.
                </p>

                <h2>7. Derechos del Interesado</h2>
                <p>Puedes ejercer los siguientes derechos en cualquier momento:</p>
                <ul>
                    <li><strong>Acceso:</strong> Conocer qué datos personales tuyos estamos tratando.</li>
                    <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</li>
                    <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
                    <li><strong>Limitación:</strong> Solicitar la restricción del tratamiento en determinadas circunstancias.</li>
                    <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado y de uso común.</li>
                    <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos en determinados supuestos.</li>
                </ul>
                <p>
                    Para ejercer estos derechos, dirígete a <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a> indicando tu identidad. También tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>.
                </p>

                <h2>8. Seguridad de los Datos</h2>
                <p>
                    En Jándula Moda aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales frente a accesos no autorizados, pérdida accidental, alteración o divulgación. Entre otras, utilizamos cifrado SSL/TLS en todas las transmisiones de datos y pasarelas de pago certificadas PCI-DSS.
                </p>

                <div className="legal-back">
                    <Link to="/">← Volver al Inicio</Link>
                </div>
            </section>
        </main>
    );
}
