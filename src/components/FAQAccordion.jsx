import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import '../styles/faq.css';

const faqs = [
    {
        question: "¿Cuánto tardará en llegar mi pedido?",
        answer: "El envío estándar rápido entrega tus pedidos entre 24 y 48 horas laborables en toda España peninsular."
    },
    {
        question: "¿Cuáles son los gastos de envío?",
        answer: "El coste del envío estándar es de solo 3,99 €. ¡Pero si tu pedido supera los 50 €, el envío es totalmente GRATIS! También disponemos de pago contra reembolso por 6,00 €."
    },
    {
        question: "¿Aceptáis devoluciones o cambios de talla?",
        answer: "¡Por supuesto! Dispones de 7 días naturales desde que recibes tu paquete para solicitar una devolución o cambio. Si devuelves una prenda, te entregaremos un vale de compra sin caducidad por el mismo importe para que lo gastes cuando quieras en nuestra web o tienda física."
    },
    {
        question: "¿Cómo tramito una devolución?",
        answer: "El proceso es facilísimo. Escríbenos a nuestro número de WhatsApp (610 505 303) o a nuestro email con tu número de pedido diciendo qué quieres devolver. El coste del transporte para la devolución (6,00 €) corre de cuenta del cliente y se te descontará del vale."
    },
    {
        question: "¿Tenéis tienda física en algún lugar?",
        answer: "¡Sí! Nos encantará conocerte. Nuestra tienda física está en C/ María Auxiliadora, 76 en Utrera (Sevilla). Todos los pedidos online pueden ser recogidos gratis o devueltos en tienda sin ningún coste."
    }
];

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <div className="faq-header">
                <HelpCircle size={32} className="faq-header-icon" />
                <h2>Preguntas Frecuentes</h2>
                <p>Resolvemos las dudas más comunes de nuestras clientas.</p>
            </div>

            <div className="faq-accordion">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? 'active' : ''}`}
                    >
                        <button
                            className="faq-question"
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={openIndex === index}
                        >
                            <span>{faq.question}</span>
                            <ChevronDown
                                size={20}
                                className={`faq-chevron ${openIndex === index ? 'rotated' : ''}`}
                            />
                        </button>
                        <div
                            className="faq-answer-wrapper"
                            style={{
                                gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                                opacity: openIndex === index ? 1 : 0
                            }}
                        >
                            <div className="faq-answer" aria-hidden={openIndex !== index}>
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
