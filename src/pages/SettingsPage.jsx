import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Field, Toggle, EmptyState } from '../components/ui';
import Icon from '../components/Icon';
import { CURRENCIES, TIMEZONES, COUNTRIES, uid } from '../data';
import { validateSettings, hasErrors } from '../validate';

export default function SettingsPage() {
  const { settings, saveSettings, showToast } = useStore();
  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState({});

  const set = (partial) => setForm((f) => ({ ...f, ...partial }));
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(settings), [form, settings]);

  const setZone = (id, partial) =>
    set({ shippingZones: form.shippingZones.map((z) => (z.id === id ? { ...z, ...partial } : z)) });
  const addZone = () =>
    set({ shippingZones: [...form.shippingZones, { id: uid(), name: '', countries: [], rate: '' }] });
  const removeZone = (id) => set({ shippingZones: form.shippingZones.filter((z) => z.id !== id) });

  const save = () => {
    const e = validateSettings(form);
    setErrors(e);
    if (hasErrors(e)) return;
    saveSettings(form);
    showToast('Settings saved');
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-sub">Store configuration for {settings.storeName}</p>
        </div>
      </div>

      <form className="settings-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="card">
          <h2 className="settings-h">Store details</h2>

          <div className="form-row">
            <Field label="Store name" htmlFor="s-name" name="storeName" required error={errors.storeName}>
              <input id="s-name" type="text" className="input"
                value={form.storeName} onChange={(e) => set({ storeName: e.target.value })} />
            </Field>
            <Field label="Support email" htmlFor="s-email" name="supportEmail" required error={errors.supportEmail}>
              <input id="s-email" type="email" className="input"
                value={form.supportEmail} onChange={(e) => set({ supportEmail: e.target.value })} />
            </Field>
          </div>

          <Field label="Store description" htmlFor="s-desc" counter={`${form.description.length}/280`}>
            <textarea id="s-desc" className="textarea" rows={2} maxLength={280}
              value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>

          <div className="form-row">
            <Field label="Store logo" htmlFor="s-logo" hint={form.logo ? `Selected: ${form.logo}` : 'PNG or SVG'}>
              <label className="filepick">
                <Icon name="upload" size={15} />
                <span>{form.logo ? 'Replace logo…' : 'Choose logo…'}</span>
                <input id="s-logo" type="file" accept=".png,.svg"
                  className="visually-hidden"
                  onChange={(e) => set({ logo: e.target.files[0] ? e.target.files[0].name : null })} />
              </label>
            </Field>
            <Field label="Timezone" htmlFor="s-tz">
              <select id="s-tz" className="select"
                value={form.timezone} onChange={(e) => set({ timezone: e.target.value })}>
                {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <div className="form-row">
            <Field label="Currency" htmlFor="s-cur">
              <select id="s-cur" className="select"
                value={form.currency} onChange={(e) => set({ currency: e.target.value })}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Weight unit">
              <fieldset className="group-options segmented">
                {[['kg', 'Kilograms'], ['lb', 'Pounds']].map(([v, l]) => (
                  <label key={v} className="opt">
                    <input type="radio" name="s-weight" value={v}
                      checked={form.weightUnit === v} onChange={(e) => set({ weightUnit: e.target.value })} />
                    <span>{l}</span>
                  </label>
                ))}
              </fieldset>
            </Field>
          </div>
        </div>

        <div className="card">
          <h2 className="settings-h">Checkout</h2>

          <Field label="Tax handling">
            <fieldset className="group-options segmented">
              {[['exclusive', 'Prices exclude tax'], ['inclusive', 'Prices include tax']].map(([v, l]) => (
                <label key={v} className="opt">
                  <input type="radio" name="s-tax" value={v}
                    checked={form.taxMode === v} onChange={(e) => set({ taxMode: e.target.value })} />
                  <span>{l}</span>
                </label>
              ))}
            </fieldset>
          </Field>

          <label className="switch-row">
            <input type="checkbox"
              checked={form.requirePhone} onChange={(e) => set({ requirePhone: e.target.checked })} />
            <span>Require a phone number at checkout</span>
          </label>

          <div className="toggle-stack">
            <Toggle checked={form.guestCheckout}
              onChange={(v) => set({ guestCheckout: v })} label="Allow guest checkout" />
            <Toggle checked={form.orderNote}
              onChange={(v) => set({ orderNote: v })} label="Show an order-note field" />
          </div>
        </div>

        <div className="card">
          <h2 className="settings-h">Email notifications</h2>
          <fieldset className="group-options chips wrap">
            {[
              ['notifyNewOrder', 'new-order', 'New order'],
              ['notifyLowStock', 'low-stock', 'Low stock'],
              ['notifyRefund', 'refund', 'Refund issued'],
              ['notifyWeekly', 'weekly', 'Weekly summary'],
            ].map(([key, id, label]) => (
              <label key={id} className="opt">
                <input type="checkbox"
                  checked={form[key]} onChange={(e) => set({ [key]: e.target.checked })} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="card">
          <div className="settings-h-row">
            <h2 className="settings-h">Shipping zones</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addZone}>
              <Icon name="plus" size={14} />
              Add zone
            </button>
          </div>

          {form.shippingZones.length === 0 ? (
            <EmptyState icon="shipping" title="No shipping zones">
              Add at least one zone so orders can be rated.
            </EmptyState>
          ) : (
            form.shippingZones.map((z) => (
              <div className="zone-row" key={z.id}>
                <Field label="Zone name" name={`zone-${z.id}-name`} error={errors[`zone-${z.id}-name`]}>
                  <input type="text" className="input"
                    value={z.name} onChange={(e) => setZone(z.id, { name: e.target.value })} />
                </Field>
                <Field label="Countries" hint="Ctrl/Cmd-click for multiple">
                  <select multiple className="select select-multi"
                    value={z.countries}
                    onChange={(e) =>
                      setZone(z.id, { countries: Array.from(e.target.selectedOptions, (o) => o.value) })
                    }>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Rate" name={`zone-${z.id}-rate`} error={errors[`zone-${z.id}-rate`]}>
                  <div className="input-affix">
                    <span className="affix">$</span>
                    <input type="number" min="0" step="0.01" className="input"
                      value={z.rate} onChange={(e) => setZone(z.id, { rate: e.target.value })} />
                  </div>
                </Field>
                <button type="button" className="btn-icon danger zone-remove" aria-label="Remove zone"
                  onClick={() => removeZone(z.id)}>
                  <Icon name="trash" size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="settings-foot">
          <span className={`footer-status tone-${dirty ? 'warning' : 'muted'}`}>
            <Icon name={dirty ? 'save' : 'checkCircle'} size={15} />
            {dirty ? 'Unsaved changes' : 'All settings saved'}
          </span>
          <div className="grow" />
          <button type="button" className="btn btn-secondary"
            disabled={!dirty} onClick={() => { setForm(settings); setErrors({}); }}>
            Discard
          </button>
          <button type="submit" className="btn btn-primary" disabled={!dirty}>
            Save settings
          </button>
        </div>
      </form>
    </section>
  );
}
