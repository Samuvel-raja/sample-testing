import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Field, Pill, statusTone, EmptyState, Toggle } from '../components/ui';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import {
  CATEGORIES, PROMO_TYPES, PROMO_APPLIES, PROMO_ELIGIBILITY, emptyPromo, promoStatus,
} from '../data';
import { validatePromotion, hasErrors } from '../validate';

const typeLabel = (t) => PROMO_TYPES.find(([v]) => v === t)?.[1] || t;

export default function PromotionsPage() {
  const { promotions, savePromotion, deletePromotion, showToast, setConfirmState } = useStore();

  const [form, setForm] = useState(emptyPromo());
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ q: '', status: '' });

  const set = (partial) => setForm((f) => ({ ...f, ...partial }));

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return promotions
      .map((p) => ({ ...p, st: promoStatus(p) }))
      .filter((p) => (!q || p.code.toLowerCase().includes(q)) && (!filters.status || p.st === filters.status));
  }, [promotions, filters]);

  const openNew = () => { setEditingId(null); setForm(emptyPromo()); setErrors({}); setOpen(true); };
  const startEdit = (p) => { setEditingId(p.id); setForm({ ...p }); setErrors({}); setOpen(true); };
  const close = () => { setOpen(false); setEditingId(null); setErrors({}); setForm(emptyPromo()); };

  const save = () => {
    const payload = { ...form, code: form.code.toUpperCase() };
    const e = validatePromotion(payload);
    setErrors(e);
    if (hasErrors(e)) return;
    savePromotion(payload);
    showToast(editingId ? 'Promotion updated' : 'Promotion created');
    close();
  };

  const removeRow = (p) => {
    setConfirmState({
      open: true,
      title: 'Delete promotion?',
      message: `Code "${p.code}" will stop working immediately.`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        deletePromotion(p.id);
        if (editingId === p.id) close();
        setConfirmState({ open: false });
        showToast('Promotion deleted');
      },
    });
  };

  const valueLabel =
    form.type === 'percent' ? 'Discount %' : form.type === 'fixed' ? 'Discount amount' : null;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Promotions</h1>
          <p className="page-sub">{promotions.length} discount codes</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={15} />
          New promotion
        </button>
      </div>

      <div className="worklist">
        <div className="toolbar">
          <div className="search-box">
              <Icon name="search" size={15} />
              <input type="text" placeholder="Search by code…"
                value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
            </div>
            <select className="select select-sm"
              value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
              <option value="">Any status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {rows.length === 0 ? (
            <EmptyState icon="percent" title="No promotions match">
              Adjust the filters or create a new promotion.
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th><th>Type</th><th>Value</th><th>Window</th><th>Uses</th><th>Status</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id}
                      className={'row-clickable' + (editingId === p.id ? ' is-editing' : '')}
                      onClick={() => startEdit(p)}>
                      <td className="cell-title">{p.code}</td>
                      <td>{typeLabel(p.type)}</td>
                      <td>{p.type === 'percent' ? `${p.value}%` : p.type === 'fixed' ? `$${p.value}` : '—'}</td>
                      <td className="cell-muted">{p.startDate || '—'} → {p.endDate || '—'}</td>
                      <td>{p.uses}</td>
                      <td><Pill tone={statusTone(p.st)}>{p.st}</Pill></td>
                      <td className="col-actions" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn-icon" title="Edit" aria-label="Edit"
                          onClick={() => startEdit(p)}>
                          <Icon name="pencil" size={15} />
                        </button>
                        <button type="button" className="btn-icon danger" title="Delete" aria-label="Delete"
                          onClick={() => removeRow(p)}>
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      <Modal
        open={open}
        onClose={close}
        title={editingId ? 'Edit promotion' : 'New promotion'}
        footer={
          <>
            {editingId && (
              <button type="button" className="btn btn-ghost danger" onClick={() => removeRow(form)}>
                Delete
              </button>
            )}
            <div className="grow" />
            <button type="button" className="btn btn-secondary" onClick={close}>
              Cancel
            </button>
            <button type="submit" form="promo-editor" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Create promotion'}
            </button>
          </>
        }
      >
        <form id="promo-editor" className="form-grid" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <Field label="Promo code" htmlFor="pr-code" name="code" required error={errors.code}>
            <input id="pr-code" type="text" className="input mono"
              autoFocus placeholder="SUMMER25" value={form.code}
              onChange={(e) => set({ code: e.target.value.toUpperCase() })} />
          </Field>

          <Field label="Discount type">
            <fieldset className="group-options segmented">
              {PROMO_TYPES.map(([v, l]) => (
                <label key={v} className="opt">
                  <input type="radio" name="pr-type" value={v}
                    checked={form.type === v} onChange={(e) => set({ type: e.target.value })} />
                  <span>{l}</span>
                </label>
              ))}
            </fieldset>
          </Field>

          {valueLabel && (
            <Field label={valueLabel} htmlFor="pr-value" name="value" required error={errors.value}>
              <div className="input-affix">
                <span className="affix">{form.type === 'percent' ? '%' : '$'}</span>
                <input id="pr-value" type="number" min="0" step="0.01" className="input"
                  placeholder="0"
                  value={form.value} onChange={(e) => set({ value: e.target.value })} />
              </div>
            </Field>
          )}

          <Field label="Applies to" htmlFor="pr-applies">
            <select id="pr-applies" className="select"
              value={form.appliesTo} onChange={(e) => set({ appliesTo: e.target.value, category: '' })}>
              {PROMO_APPLIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>

          {form.appliesTo === 'category' && (
            <Field label="Category" htmlFor="pr-cat" name="category" required error={errors.category}>
              <select id="pr-cat" className="select"
                value={form.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          )}

          <div className="form-row">
            <Field label="Start date" htmlFor="pr-start">
              <input id="pr-start" type="date" className="input" min="2000-01-01" max="2035-12-31"
                value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            </Field>
            <Field label="End date" htmlFor="pr-end" name="end-date" error={errors.endDate}>
              <input id="pr-end" type="date" className="input" max="2035-12-31"
                min={form.startDate || '2000-01-01'}
                value={form.endDate} onChange={(e) => set({ endDate: e.target.value })} />
            </Field>
          </div>

          <div className="form-row">
            <Field label="Minimum spend" htmlFor="pr-min">
              <div className="input-affix">
                <span className="affix">$</span>
                <input id="pr-min" type="number" min="0" step="0.01" className="input"
                  placeholder="0.00"
                  value={form.minSpend} onChange={(e) => set({ minSpend: e.target.value })} />
              </div>
            </Field>
            <Field label="Usage limit" htmlFor="pr-limit" hint="0 = unlimited">
              <input id="pr-limit" type="number" min="0" step="1" className="input"
                placeholder="0"
                value={form.usageLimit} onChange={(e) => set({ usageLimit: e.target.value })} />
            </Field>
          </div>

          <Field label="Customer eligibility">
            <fieldset className="group-options segmented">
              {PROMO_ELIGIBILITY.map(([v, l]) => (
                <label key={v} className="opt">
                  <input type="radio" name="pr-elig" value={v}
                    checked={form.eligibility === v} onChange={(e) => set({ eligibility: e.target.value })} />
                  <span>{l}</span>
                </label>
              ))}
            </fieldset>
          </Field>

          <Field label="Rules">
            <label className="switch-row">
              <input type="checkbox"
                checked={form.canStack} onChange={(e) => set({ canStack: e.target.checked })} />
              <span>Can be combined with other promotions</span>
            </label>
          </Field>

          <Field label="Status">
            <Toggle checked={form.active}
              onChange={(v) => set({ active: v })} label={form.active ? 'Active' : 'Inactive'} />
          </Field>

        </form>
      </Modal>
    </section>
  );
}
