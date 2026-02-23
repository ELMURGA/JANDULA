import { Truck, ShieldCheck, Clock } from 'lucide-react';
import '../styles/sections.css';

const props = [
    {
        icon: <Truck size={32} strokeWidth={1.5} />,
        title: 'Envíos a toda España',
        desc: 'Recíbelo en 24/48h en tu domicilio',
    },
    {
        icon: <ShieldCheck size={32} strokeWidth={1.5} />,
        title: 'Pago 100% Seguro',
        desc: 'Tarjetas, Bizum y pasarelas verificadas',
    },
    {
        icon: <Clock size={32} strokeWidth={1.5} />,
        title: 'Atención Personalizada',
        desc: 'Te asesoramos desde nuestra tienda en Utrera',
    },
];

export default function ValueProps() {
    return (
        <section className="value-props">
            <div className="container">
                <div className="value-props__grid">
                    {props.map((item) => (
                        <div key={item.title} className="value-prop">
                            <div className="value-prop__icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
