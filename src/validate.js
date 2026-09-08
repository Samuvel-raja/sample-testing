export const hasErrors = (e) => Object.keys(e).length > 0;

export function validateProduct(d) {
  const e = {};
  if (!(d.name || '').trim()) e.name = 'Product name is required';
  if (d.price === '' || d.price == null || isNaN(Number(d.price)) || Number(d.price) < 0) {
    e.price = 'Enter a valid price';
  }
  if (d.compareAtPrice !== '' && d.compareAtPrice != null) {
    if (isNaN(Number(d.compareAtPrice)) || Number(d.compareAtPrice) < 0) {
      e.compareAtPrice = 'Enter a valid amount';
    } else if (Number(d.compareAtPrice) > 0 && Number(d.compareAtPrice) <= Number(d.price)) {
      e.compareAtPrice = 'Compare-at should be higher than price';
    }
  }
  return e;
}

export function validateAdjustment(d) {
  const e = {};
  if (!d.productId) e.productId = 'Pick a product';
  if (d.quantity === '' || isNaN(Number(d.quantity)) || Number(d.quantity) < 0) {
    e.quantity = 'Enter a quantity';
  }
  return e;
}

export function validatePromotion(d) {
  const e = {};
  if (!(d.code || '').trim()) e.code = 'A code is required';
  if (d.type !== 'shipping') {
    if (d.value === '' || isNaN(Number(d.value)) || Number(d.value) <= 0) {
      e.value = 'Enter a value above 0';
    } else if (d.type === 'percent' && Number(d.value) > 100) {
      e.value = 'Percentage can’t exceed 100';
    }
  }
  if (d.appliesTo === 'category' && !d.category) e.category = 'Pick a category';
  if (d.startDate && d.endDate && d.endDate < d.startDate) e.endDate = 'End date is before start';
  return e;
}

export function validateSettings(d) {
  const e = {};
  if (!(d.storeName || '').trim()) e.storeName = 'Store name is required';
  if (!/^\S+@\S+\.\S+$/.test(d.supportEmail || '')) e.supportEmail = 'Enter a valid email';
  d.shippingZones.forEach((z) => {
    if (!(z.name || '').trim()) e[`zone-${z.id}-name`] = 'Name this zone';
    if (z.rate === '' || isNaN(Number(z.rate)) || Number(z.rate) < 0) e[`zone-${z.id}-rate`] = 'Enter a rate';
  });
  return e;
}
