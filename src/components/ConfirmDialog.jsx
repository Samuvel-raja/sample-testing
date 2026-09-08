import Icon from './Icon';
import { useStore } from '../store';

export default function ConfirmDialog() {
  const { confirmState, setConfirmState } = useStore();
  if (!confirmState.open) return null;

  const close = () => setConfirmState({ open: false });

  return (
    <div className="modal-overlay" onClick={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-icon">
          <Icon name="alertTriangle" size={20} />
        </span>
        <h3 className="modal-title">
          {confirmState.title || 'Please confirm'}
        </h3>
        <p className="modal-body">
          {confirmState.message || 'Are you sure?'}
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => confirmState.onConfirm && confirmState.onConfirm()}
          >
            {confirmState.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
