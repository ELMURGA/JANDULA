import { ShoppingBag } from 'lucide-react';
import '../styles/global.css';

export default function Toast({ message }) {
    return (
        <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">
            <div className="toast__inner">
                <ShoppingBag size={16} />
                <span>{message}</span>
            </div>
        </div>
    );
}
