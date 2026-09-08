import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Field, Pill, statusTone, EmptyState, relTime } from '../components/ui';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import {
  CATEGORIES, categoryMap, STATUSES, PRODUCT_TAGS, emptyProduct,
} from '../data';
import { validateProduct, hasErrors } from '../validate';

export default function CatalogPage() {
  const { products, saveProduct, deleteProduct, showToast, setConfirmState } = useStore();

  const [form, setForm] = useState(emptyProduct());
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ q: '', category: '' });

  const set = (partial) => setForm((f) => ({ ...f, ...partial }));
  const subs = categoryMap[form.category] || [];

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!filters.category || p.category === filters.category)
    );
  }, [products, filters]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyProduct());
    setErrors({});
    setOpen(true);
  };
  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p });
    setErrors({});
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setEditingId(null);
    setErrors({});
    setForm(emptyProduct());
  };
  const save = () => {
    const e = validateProduct(form);
    setErrors(e);
    if (hasErrors(e)) return;
    saveProduct(form);
    showToast(editingId ? 'Product updated' : 'Product added');
    close();
  };
  const removeRow = (p) => {
    setConfirmState({
      open: true,
      title: 'Delete product?',
      message: `"${p.name || 'This product'}" and its stock lines will be removed.`,
      confirmLabel: 'Delete',
      onConfirm: () => {
        deleteProduct(p.id);
        if (editingId === p.id) close();
        setConfirmState({ open: false });
        showToast('Product deleted');
      },
    });
  };
  const toggleTag = (t) =>
    set({ tags: form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t] });

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Catalog</h1>
          <p className="page-sub">{products.length} products</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={15} />
          New product
        </button>
      </div>

      <div className="worklist">
        <div className="toolbar">
            <div className="search-box">
              <Icon name="search" size={15} />
              <input
                type="text"
                placeholder="Search products…"
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
              />
            </div>
            <select
              className="select select-sm"
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFilters({ q: '', category: '' })}
            >
              Clear
            </button>
          </div>

          {rows.length === 0 ? (
            <EmptyState icon="catalog" title="No products match">
              Adjust the filters or add a new product.
            </EmptyState>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Updated</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr
                      key={p.id}
                      className={'row-clickable' + (editingId === p.id ? ' is-editing' : '')}
                      onClick={() => startEdit(p)}
                    >
                      <td>
                        <span className="cell-title">{p.name || 'Untitled'}</span>
                        {p.featured && <span className="feat-dot" title="Featured"><Icon name="star" size={12} /></span>}
                      </td>
                      <td>{p.category || '—'}</td>
                      <td>{p.price === '' ? '—' : `$${p.price}`}</td>
                      <td><Pill tone={statusTone(p.status)}>{p.status}</Pill></td>
                      <td className="cell-muted">{relTime(p.updatedAt)}</td>
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
        title={editingId ? 'Edit product' : 'New product'}
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
            <button type="submit" form="catalog-editor" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Add product'}
            </button>
          </>
        }
      >
        <form
          id="catalog-editor"
          className="form-grid"
          onSubmit={(e) => { e.preventDefault(); save(); }}
        >
          <Field label="Product name" htmlFor="c-name" name="name" required error={errors.name}>
            <input id="c-name" type="text" className="input"
              autoFocus placeholder="e.g. Aurora Wireless Headphones"
              value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </Field>

          <Field label="Description" htmlFor="c-desc" counter={`${form.description.length}/500`}>
            <textarea id="c-desc" className="textarea" rows={3} maxLength={500}
              value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>

          <div className="form-row">
            <Field label="Category" htmlFor="c-cat">
              <select id="c-cat" className="select"
                value={form.category} onChange={(e) => set({ category: e.target.value, subcategory: '' })}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Subcategory" htmlFor="c-sub" hint={subs.length ? undefined : 'Pick a category first'}>
              <select id="c-sub" className="select"
                value={form.subcategory} disabled={!subs.length}
                onChange={(e) => set({ subcategory: e.target.value })}>
                <option value="">Select…</option>
                {subs.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Status">
            <fieldset className="group-options segmented">
              {STATUSES.map((s) => {
                const v = s.toLowerCase();
                return (
                  <label key={v} className="opt">
                    <input type="radio" name="c-status" value={v}
                      checked={form.status === v} onChange={(e) => set({ status: e.target.value })} />
                    <span>{s}</span>
                  </label>
                );
              })}
            </fieldset>
          </Field>

          <div className="form-row">
            <Field label="Price" htmlFor="c-price" name="price" required error={errors.price}>
              <div className="input-affix">
                <span className="affix">$</span>
                <input id="c-price" type="number" min="0" step="0.01" className="input"
                  placeholder="0.00"
                  value={form.price} onChange={(e) => set({ price: e.target.value })} />
              </div>
            </Field>
            <Field label="Compare-at price" htmlFor="c-cmp" name="compare-at-price" error={errors.compareAtPrice}>
              <div className="input-affix">
                <span className="affix">$</span>
                <input id="c-cmp" type="number" min="0" step="0.01" className="input"
                  placeholder="0.00"
                  value={form.compareAtPrice} onChange={(e) => set({ compareAtPrice: e.target.value })} />
              </div>
            </Field>
          </div>

          <Field label="Visibility">
            <label className="switch-row">
              <input type="checkbox"
                checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              <span>Featured product</span>
            </label>
          </Field>

          <Field label="Tags">
            <fieldset className="group-options chips">
              {PRODUCT_TAGS.map((t) => (
                <label key={t} className="opt">
                  <input type="checkbox"
                    checked={form.tags.includes(t)} onChange={() => toggleTag(t)} />
                  <span>{t}</span>
                </label>
              ))}
            </fieldset>
          </Field>

        </form>
      </Modal>
    </section>
  );
}
