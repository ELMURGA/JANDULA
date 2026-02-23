import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import FAQAccordion from '../components/FAQAccordion';
import '../styles/pages.css';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://formspree.io/f/TU_ID_AQUI", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setSubmitted(true);
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                alert("Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            alert("Error de conexión al enviar el formulario.");
        }
    };

    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--contact">
                <h1>Contacto</h1>
                <p>Estamos encantadas de atenderte. Visítanos, llámanos o escríbenos directamente.</p>
            </div>

            <section className="contact-section container">
                <div className="contact-grid">
                    {/* Contact Info Cards */}
                    <div className="contact-info">
                        <div className="contact-card">
                            <div className="contact-card__icon"><MapPin size={24} /></div>
                            <div>
                                <h3>Nuestra Tienda</h3>
                                <p>Av. María Auxiliadora, 76<br />41710 Utrera, Sevilla (España)</p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card__icon"><Phone size={24} /></div>
                            <div>
                                <h3>Teléfono & WhatsApp</h3>
                                <p><a href="tel:+34610505303">610 505 303</a></p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card__icon"><Mail size={24} /></div>
                            <div>
                                <h3>Correo Electrónico</h3>
                                <p><a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a></p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card__icon"><Clock size={24} /></div>
                            <div>
                                <h3>Horario</h3>
                                <p>Lunes a Viernes: 10:00 – 14:00 / 17:30 – 21:00<br />Sábados: 10:00 – 14:00</p>
                            </div>
                        </div>

                        <a
                            href="https://wa.me/34610505303?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-whatsapp-btn"
                        >
                            <MessageCircle size={20} />
                            Escríbenos por WhatsApp
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrap">
                        <h2>Envíanos un Mensaje</h2>
                        <p className="contact-form-desc">
                            Rellena el formulario y te responderemos al correo o teléfono proporcionado lo antes posible.
                        </p>

                        {submitted ? (
                            <div className="contact-success">
                                <Send size={32} />
                                <p>¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre completo</label>
                                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Teléfono</label>
                                        <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Mensaje</label>
                                    <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required></textarea>
                                </div>
                                <button type="submit" className="contact-submit-btn">
                                    <Send size={16} /> Enviar Mensaje
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <FAQAccordion />

                {/* Map */}
                <div className="contact-map">
                    <iframe
                        title="Ubicación Jándula Moda Utrera"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1590.0!2d-5.7809577!3d37.1851542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd12a4c0a9c5e8af%3A0x5b0c14d06e8c3a72!2sAv.%20Mar%C3%ADa%20Auxiliadora%2C%2076%2C%2041710%20Utrera%2C%20Sevilla!5e0!3m2!1ses!2ses!4v1708800000000"
                        width="100%"
                        height="400"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </main>
    );
}
