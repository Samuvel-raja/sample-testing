import Icon from './Icon';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

export function SectionHeader({ icon, title, description, aside }) {
  return (
    <div className="section-header">
      <div className="section-heading">
        {icon && (
          <span className="section-icon">
            <Icon name={icon} size={18} />
          </span>
        )}
        <div>
          <h2>{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </div>
      </div>
      {aside && <div className="section-aside">{aside}</div>}
    </div>
  );
}

// Single control with its label, optional hint, and an inline validation error.
export function Field({ label, htmlFor, required, hint, error, counter, children }) {
  return (
    <div className={`field2${error ? ' has-error' : ''}`}>
      {label && (
        <div className="field2-label">
          <label htmlFor={htmlFor}>
            {label}
            {required && <span className="req" aria-hidden="true"> *</span>}
          </label>
          {counter != null && <span className="counter">{counter}</span>}
        </div>
      )}
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && (
        <span className="error">
          <Icon name="alertCircle" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}

export function Pill({ tone = 'neutral', children }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export const statusTone = (s) =>
  ({
    draft: 'neutral', published: 'success', archived: 'warning',
    active: 'success', scheduled: 'info', expired: 'neutral', inactive: 'neutral',
    'in stock': 'success', low: 'warning', out: 'danger',
  }[String(s).toLowerCase()] || 'neutral');

export function EmptyState({ icon = 'inbox', title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={24} />
      </span>
      <p className="empty-title">{title}</p>
      {children && <p className="empty-text">{children}</p>}
      {action}
    </div>
  );
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label className={`toggle${disabled ? ' is-disabled' : ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true"><span className="toggle-thumb" /></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}

export function Stepper({ value, onChange, min = 0, step = 1 }) {
  const n = Number(value) || 0;
  return (
    <div className="stepper">
      <button
        type="button"
        className="btn-icon"
        aria-label="Decrease"
        onClick={() => onChange(String(Math.max(min, n - step)))}
      >
        <Icon name="minus" size={14} />
      </button>
      <input
        type="number"
        className="input"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="btn-icon"
        aria-label="Increase"
        onClick={() => onChange(String(n + step))}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

export function SummaryRow({ label, value }) {
  const empty = value === '' || value == null || value === false;
  return (
    <div className="summary-row">
      <dt>{label}</dt>
      <dd className={empty ? 'is-empty' : undefined}>
        {empty ? '—' : value}
      </dd>
    </div>
  );
}

export function relTime(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : `${Math.round(d / 30)}mo ago`;
}
