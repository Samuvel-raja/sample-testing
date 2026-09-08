import assert from 'node:assert';
import {
  validateProduct, validateAdjustment, validatePromotion, validateSettings, hasErrors,
} from './validate.js';

// product
assert.ok(!hasErrors(validateProduct({ name: 'X', price: '10', compareAtPrice: '' })), 'valid product');
assert.ok(validateProduct({ name: ' ', price: '10' }).name, 'blank name');
assert.ok(validateProduct({ name: 'X', price: '' }).price, 'missing price');
assert.ok(validateProduct({ name: 'X', price: '10', compareAtPrice: '8' }).compareAtPrice, 'compare-at below price');
assert.ok(!hasErrors(validateProduct({ name: 'X', price: '10', compareAtPrice: '15' })), 'compare-at above price ok');

// adjustment
assert.ok(validateAdjustment({ productId: '', quantity: '5' }).productId, 'no product');
assert.ok(validateAdjustment({ productId: 'p', quantity: '' }).quantity, 'no qty');
assert.ok(!hasErrors(validateAdjustment({ productId: 'p', quantity: '5' })), 'valid adjustment');

// promotion
assert.ok(validatePromotion({ code: '', type: 'percent', value: '10' }).code, 'no code');
assert.ok(validatePromotion({ code: 'A', type: 'percent', value: '120' }).value, 'percent > 100');
assert.ok(validatePromotion({ code: 'A', type: 'category', value: '5', appliesTo: 'category', category: '' }).category, 'category required');
assert.ok(!hasErrors(validatePromotion({ code: 'A', type: 'shipping', appliesTo: 'order' })), 'free shipping needs no value');
assert.ok(
  validatePromotion({ code: 'A', type: 'fixed', value: '5', appliesTo: 'order', startDate: '2026-02-01', endDate: '2026-01-01' }).endDate,
  'end before start'
);

// settings
const okSettings = { storeName: 'S', supportEmail: 'a@b.co', shippingZones: [{ id: 'z', name: 'Z', rate: '5' }] };
assert.ok(!hasErrors(validateSettings(okSettings)), 'valid settings');
assert.ok(validateSettings({ ...okSettings, supportEmail: 'nope' }).supportEmail, 'bad email');
assert.ok(validateSettings({ ...okSettings, shippingZones: [{ id: 'z', name: '', rate: '' }] })['zone-z-name'], 'zone name required');

console.log('validate.test.js: ok');
