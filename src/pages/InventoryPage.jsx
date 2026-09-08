import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Field, Pill, statusTone, EmptyState, Stepper } from '../components/ui';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { LOCATIONS, ADJUST_REASONS } from '../data';
import { validateAdjustment, hasErrors } from '../validate';

const lineStatus = (i) => {
  if (i.onHand <= 0) return 'out';
  if (i.onHand - i.reserved <= i.reorderPoint) return 'low';
  return 'in stock';
};

const emptyAdj = () => ({
  productId: '',
  location: 'Main Warehouse',
  mode: 'add',
  quantity: '',
  reorderPoint: '',
  reason: 'Received shipment',
  note: '',
});

export default function InventoryPage() {
  const { inventory, products, applyAdjustment, showToast } = useStore();
  const [form, setForm] = useState(emptyAdj());
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ q: '', location: '', lowOnly: false });

  const openPanel = (productId) => {
    setForm({ ...emptyAdj(), productId: productId || '' });
    setErrors({});
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setForm(emptyAdj());
    setErrors({});
  };

  const set = (partial) => setForm((f) => ({ ...f, ...partial }));
  const nameOf = (pid) => products.find((p) => p.id === pid)?.name || '—';

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return inventory
      .map((i) => ({ ...i, product: nameOf(i.productId), available: i.onHand - i.reserved, st: lineStatus(i) }))
      .filter(
        (i) =>
          (!q || i.product.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)) &&
          (!filters.location || i.location === filters.location) &&
          (!filters.lowOnly || i.st !== 'in stock')
      );
  }, [inventory, products, filters]);

  const apply = () => {
    const e = validateAdjustment(form);
    setErrors(e);
    if (hasErrors(e)) return;
    applyAdjustment(form);
    showToast('Stock adjusted');
    close();
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Inventory</h1>
          <p className="page-sub">{inventory.length} stock lines across {LOCATIONS.length} locations</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openPanel()}>
          <Icon name="plus" size={15} />
          Adjust stock
        </button>
      </div>

      <div className="worklist">
        <div className="toolbar">
          <div className="search-box">
              <Icon name="search" size={15} />
              <input
                type="text"
                placeholder="Search product or SKU…"
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              />
            </div>
            <select
              className="select select-sm"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            >
              <option value="">All locations</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <label className="switch-row inline-check">
              <input
                type="checkbox"
                checked={filters.lowOnly}
                onChange={(e) => setFilters((f) => ({ ...f, lowOnly: e.target.checked }))}
              />
              <span>Low / out only</span>
            </label>
          </div>

          {rows.length === 0 ? (
            <EmptyState icon="inventory" title="No stock lines match">
              Adjust the filters above.
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th><th>SKU</th><th>Location</th>
                    <th>On hand</th><th>Reserved</th><th>Available</th><th>Reorder</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id}
                      className="row-clickable" onClick={() => openPanel(i.productId)}>
                      <td className="cell-title">{i.product}</td>
                      <td className="cell-muted">{i.sku}</td>
                      <td>{i.location}</td>
                      <td>{i.onHand}</td>
                      <td>{i.reserved}</td>
                      <td>{i.available}</td>
                      <td>{i.reorderPoint}</td>
                      <td><Pill tone={statusTone(i.st)}>{i.st}</Pill></td>
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
        title="Adjust stock"
        footer={
          <>
            <div className="grow" />
            <button type="button" className="btn btn-secondary" onClick={close}>
              Cancel
            </button>
            <button type="submit" form="inventory-editor" className="btn btn-primary">
              Apply adjustment
            </button>
          </>
        }
      >
        <form id="inventory-editor" className="form-grid" onSubmit={(e) => { e.preventDefault(); apply(); }}>
          <Field label="Product" htmlFor="iv-product" name="productId" required error={errors.productId}>
            <select id="iv-product" className="select"
              value={form.productId} onChange={(e) => set({ productId: e.target.value })}>
              <option value="">Select a product…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>

          <Field label="Location" htmlFor="iv-loc">
            <select id="iv-loc" className="select"
              value={form.location} onChange={(e) => set({ location: e.target.value })}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Adjustment">
            <fieldset className="group-options segmented">
              {[['set', 'Set to'], ['add', 'Add'], ['remove', 'Remove']].map(([v, l]) => (
                <label key={v} className="opt">
                  <input type="radio" name="iv-mode" value={v}
                    checked={form.mode === v} onChange={(e) => set({ mode: e.target.value })} />
                  <span>{l}</span>
                </label>
              ))}
            </fieldset>
          </Field>

          <div className="form-row">
            <Field label="Quantity" name="quantity" required error={errors.quantity}>
              <Stepper value={form.quantity} onChange={(v) => set({ quantity: v })} />
            </Field>
            <Field label="Reorder point" htmlFor="iv-reorder" hint="Leave blank to keep current">
              <input id="iv-reorder" type="number" min="0" step="1" className="input"
                placeholder="—"
                value={form.reorderPoint} onChange={(e) => set({ reorderPoint: e.target.value })} />
            </Field>
          </div>

          <Field label="Reason" htmlFor="iv-reason">
            <select id="iv-reason" className="select"
              value={form.reason} onChange={(e) => set({ reason: e.target.value })}>
              {ADJUST_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Note" htmlFor="iv-note">
            <textarea id="iv-note" className="textarea" rows={2}
              placeholder="Optional context for the audit log"
              value={form.note} onChange={(e) => set({ note: e.target.value })} />
          </Field>

        </form>
      </Modal>
    </section>
  );
}
