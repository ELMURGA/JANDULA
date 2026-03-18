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
        answer: "¡Por supuesto! Dispones de 7 días desde que recibes tu pedido para solicitar una devolución o cambio (3 días en el caso de trajes de fiesta e invitada). No se aceptan devoluciones de complementos y bolsos. Te devolveremos el importe del pedido en forma de vale que podrás canjear en los 6 meses siguientes."
    },
    {
        question: "¿Cómo tramito una devolución?",
        answer: "Escríbenos a nuestro número de WhatsApp (610 505 303) en los próximos 7 días desde la llegada de tu pedido. El coste del envío de la devolución son 6 € (independientes del envío del nuevo producto si hay cambio). Una vez recibido y evaluado, te enviaremos tu vale de compra."
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
