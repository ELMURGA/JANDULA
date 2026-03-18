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
                <h2>1. Política General y Reembolso</h2>
                <p>En Jándula Moda queremos que todas nuestras clientas queden satisfechas con sus compras. Si no has quedado satisfecha, <strong>te devolvemos el importe de tu pedido en forma de vale</strong>.</p>
                <div className="legal-highlight">
                    <p>
                        Este vale tendrá una validez para poder <strong>canjearse en los 6 meses siguientes</strong> a su emisión.
                    </p>
                </div>

                <h2>2. Plazos y Contacto</h2>
                <p>
                    Para realizar una devolución, debes ponerte en contacto con nosotras por WhatsApp al <a href="tel:+34610505303">610 505 303</a> en los <strong>próximos 7 días</strong> desde que llegó tu pedido.
                </p>

                <h2>3. Gastos de Envío</h2>
                <div className="legal-info-box">
                    <p><strong>Coste del envío de devolución:</strong> 6,00 €</p>
                    <p>Estos costes son independientes del envío del nuevo producto en su caso, que serán de:</p>
                    <ul>
                      <li>Envío normal: 3,99 €</li>
                      <li>Contra reembolso: 6,00 €</li>
                    </ul>
                </div>

                <h2>4. Evaluación y Rechazo de Devoluciones</h2>
                <p>Una vez recibido el producto en nuestras instalaciones, se evaluará su estado. Si se detectan daños no comunicados previamente, se informará al cliente vía correo electrónico sobre la resolución de su caso.</p>
                <p><strong>Jándula Moda se reserva el derecho de rechazar una devolución en los siguientes casos:</strong></p>
                <ol>
                    <li>Si el producto no cumple con las condiciones anteriormente mencionadas.</li>
                    <li>Si el cliente no ha seguido el proceso de devolución correctamente.</li>
                </ol>
                <p>En caso de rechazo, se notificará al cliente por correo electrónico y se ofrecerá la posibilidad de reenviar el paquete al remitente, <strong>siempre que el cliente asuma los costes de envío</strong>.</p>

                <h2>5. Productos con Excepciones</h2>
                <ul>
                    <li>No se aceptará la devolución de <strong>complementos y bolsos</strong>.</li>
                    <li>En el caso de nuestros <strong>trajes de fiesta e invitada</strong>, solo se permitirá la devolución en los <strong>próximos 3 días</strong> tras la recepción.</li>
                </ul>

                <h2>6. Contacto</h2>
                <p>Para cualquier duda sobre devoluciones y reembolsos o iniciar un trámite:</p>
                <ul>
                    <li><strong>WhatsApp:</strong> <a href="tel:+34610505303">610 505 303</a></li>
                    <li><strong>Email:</strong> <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a></li>
                    <li><strong>Tienda Física:</strong> C/ María Auxiliadora, 76 — 41710 Utrera, Sevilla</li>
                </ul>

                <div className="legal-back">
                    <Link to="/">← Volver al Inicio</Link>
                </div>
            </section>
        </main>
    );
}
