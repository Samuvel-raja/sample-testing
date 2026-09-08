import Icon from './Icon';
import { useStore } from '../store';

export default function Toast() {
  const { toast, clearToast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span className="toast-icon">
        <Icon name="checkCircle" size={18} />
      </span>
      <span className="toast-msg">{toast}</span>
      <button
        type="button"
        className="toast-dismiss"
        onClick={clearToast}
        aria-label="Dismiss"
      >
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
