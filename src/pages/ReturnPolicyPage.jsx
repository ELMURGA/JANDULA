import { Link } from 'react-router-dom';
import '../styles/pages.css';

export default function ReturnPolicyPage() {
    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--legal">
                <h1>Política de Devoluciones y Reembolsos</h1>
                <p>Conoce las condiciones para devolver tus compras</p>
            </div>

            <section className="legal-content container">
                <h2>1. Plazo de Devolución</h2>
                <p>
                    Dispones de <strong>7 días naturales</strong> desde la recepción del pedido para comunicarnos tu deseo de devolver uno o varios artículos. Para iniciar el proceso, contacta con nosotros a través de WhatsApp (<a href="tel:+34610505303">610 505 303</a>) o email (<a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a>).
                </p>

                <h2>2. Forma de Reembolso</h2>
                <div className="legal-highlight">
                    <p>
                        Las devoluciones se realizan mediante un <strong>vale de compra sin caducidad</strong> por el importe del producto devuelto. Este vale podrás canjearlo en cualquier compra futura en nuestra tienda online o tienda física.
                    </p>
                </div>

                <h2>3. Condiciones de la Devolución</h2>
                <p>Para que una devolución sea aceptada, los productos deben cumplir las siguientes condiciones:</p>
                <ul>
                    <li>El artículo debe estar en perfecto estado, sin usar, sin lavar y con todas sus etiquetas originales.</li>
                    <li>Debe incluirse el embalaje original en buen estado.</li>
                    <li>Se debe adjuntar el ticket o comprobante de compra.</li>
                    <li>No se aceptan devoluciones de artículos de ropa interior, bañadores, pendientes ni artículos marcados como "sin devolución".</li>
                </ul>

                <h2>4. Gastos de Envío</h2>
                <div className="legal-info-box">
                    <p><strong>Envío estándar:</strong> 3,99 € (gratuito en pedidos superiores a 50 €)</p>
                    <p><strong>Contra reembolso:</strong> 6,00 €</p>
                    <p><strong>Coste de envío de devolución:</strong> 6,00 € (descontado del vale de compra)</p>
                </div>
                <p>
                    Los gastos de envío de la devolución corren a cargo del cliente y serán descontados automáticamente del importe del vale. Si la devolución se realiza en nuestra tienda física de Utrera, no se aplicará ningún coste adicional.
                </p>

                <h2>5. Procedimiento de Devolución</h2>
                <ol>
                    <li><strong>Comunícalo:</strong> Escríbenos por WhatsApp al 610 505 303 o envía un email a jandulamodautrera@gmail.com indicando tu número de pedido y los artículos que deseas devolver.</li>
                    <li><strong>Prepara el paquete:</strong> Empaqueta los artículos cuidadosamente en su embalaje original con todas las etiquetas.</li>
                    <li><strong>Envía:</strong> Te indicaremos la dirección y el método de envío. También puedes traerlo a nuestra tienda en C/ María Auxiliadora 76, Utrera.</li>
                    <li><strong>Recibe tu vale:</strong> Una vez verificado el estado del artículo, recibirás tu vale de compra en un plazo de 3-5 días laborables.</li>
                </ol>

                <h2>6. Cambios de Talla</h2>
                <p>
                    Si necesitas cambiar la talla de un producto, contacta con nosotros y te gestionaremos el cambio directamente, sujeto a disponibilidad de stock. Los cambios de talla realizados en nuestra tienda física son inmediatos y sin coste alguno.
                </p>

                <h2>7. Productos Defectuosos</h2>
                <p>
                    Si recibes un producto defectuoso o dañado durante el transporte, contacta con nosotros inmediatamente. En estos casos, realizaremos el cambio o devolución completa sin ningún coste para ti, incluyendo los gastos de envío.
                </p>

                <h2>8. Contacto</h2>
                <p>Para cualquier duda sobre devoluciones y reembolsos:</p>
                <ul>
                    <li><strong>WhatsApp:</strong> <a href="tel:+34610505303">610 505 303</a></li>
                    <li><strong>Email:</strong> <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a></li>
                    <li><strong>Tienda:</strong> C/ María Auxiliadora, 76 — 41710 Utrera, Sevilla</li>
                </ul>

                <div className="legal-back">
                    <Link to="/">← Volver al Inicio</Link>
                </div>
            </section>
        </main>
    );
}
