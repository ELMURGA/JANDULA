import WhatsAppIcon from './WhatsAppIcon';

export default function WhatsAppButton() {
    const message = encodeURIComponent('Hola Jándula Moda  Me gustaría hacer una consulta sobre vuestros productos.');
    return (
        <a
            href={`https://wa.me/34610505303?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Contactar por WhatsApp"
        >
            <WhatsAppIcon size={28} color="#fff" />
            <span className="whatsapp-float__tooltip">¿Necesitas ayuda?</span>
        </a>
    );
}
