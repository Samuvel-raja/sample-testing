import { useEffect } from 'react';
import Icon from './Icon';

/**
 * Centered modal dialog. The editor form is passed as `children`; the footer
 * buttons are passed as `footer`. A submit button in the footer can target the
 * form with `form="<id>"`.
 */
export default function Modal({ open, title, onClose, footer, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={`modal-form modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal-form-head">
          <h2>{title}</h2>
          <button type="button" className="btn-icon" aria-label="Close" onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </header>
        <div className="modal-form-body">{children}</div>
        {footer && <footer className="modal-form-foot">{footer}</footer>}
      </div>
    </div>
  );
}
