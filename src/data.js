export const CATEGORIES = ['Electronics', 'Apparel', 'Home & Garden', 'Sports', 'Books'];

export const categoryMap = {
  Electronics: ['Phones', 'Laptops', 'Cameras', 'Accessories'],
  Apparel: ['Shirts', 'Pants', 'Shoes', 'Outerwear'],
  'Home & Garden': ['Furniture', 'Kitchen', 'Decor', 'Tools'],
  Sports: ['Fitness', 'Cycling', 'Camping', 'Team Sports'],
  Books: ['Fiction', 'Non-fiction', 'Comics', 'Textbooks'],
};

export const STATUSES = ['Draft', 'Published', 'Archived'];
export const PRODUCT_TAGS = ['New', 'Sale', 'Clearance', 'Bestseller', 'Limited'];

export const LOCATIONS = ['Main Warehouse', 'Store Front', 'Returns Bin'];
export const ADJUST_REASONS = ['Recount', 'Damaged', 'Received shipment', 'Correction', 'Theft / loss'];

export const MEDIA_TAGS = ['Hero', 'Lifestyle', 'Packshot', 'Detail', 'Swatch'];
export const MEDIA_SORTS = [
  ['new', 'Newest first'],
  ['name', 'Name A–Z'],
  ['size', 'Largest first'],
];

export const PROMO_TYPES = [
  ['percent', 'Percentage'],
  ['fixed', 'Fixed amount'],
  ['shipping', 'Free shipping'],
];
export const PROMO_APPLIES = [
  ['order', 'Entire order'],
  ['category', 'Specific category'],
  ['products', 'Specific products'],
];
export const PROMO_ELIGIBILITY = [
  ['all', 'All customers'],
  ['first', 'First-time only'],
  ['returning', 'Returning customers'],
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];
export const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles',
  'Europe/London', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney',
];
export const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
  'Italy', 'Spain', 'China', 'Japan', 'India', 'Brazil', 'Australia',
  'South Korea', 'Netherlands',
];

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const uid = () => (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2);

const DAY = 86400000;

// inline SVG data URIs so seed media renders real thumbnails without File objects
const swatch = (bg, label) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180"><rect width="240" height="180" fill="${bg}"/><text x="120" y="96" font-family="system-ui,sans-serif" font-size="15" fill="rgba(255,255,255,.92)" text-anchor="middle">${label}</text></svg>`
  );

export const SEED = {
  products: [
    {
      id: 'p-aurora', name: 'Aurora Wireless Headphones', description: 'Over-ear ANC headphones, 40h battery, USB-C fast charge.',
      category: 'Electronics', subcategory: 'Accessories', status: 'published',
      price: '129.99', compareAtPrice: '159.99', featured: true, tags: ['Bestseller'],
      createdAt: Date.now() - DAY * 40, updatedAt: Date.now() - DAY * 2,
    },
    {
      id: 'p-trailhead', name: 'Trailhead 30L Backpack', description: 'Weather-sealed hiking pack with hydration sleeve.',
      category: 'Sports', subcategory: 'Camping', status: 'published',
      price: '89.00', compareAtPrice: '', featured: false, tags: ['New'],
      createdAt: Date.now() - DAY * 30, updatedAt: Date.now() - DAY * 9,
    },
    {
      id: 'p-terracotta', name: 'Terracotta Planter Set', description: 'Three hand-thrown planters with drainage trays.',
      category: 'Home & Garden', subcategory: 'Decor', status: 'draft',
      price: '34.50', compareAtPrice: '', featured: false, tags: [],
      createdAt: Date.now() - DAY * 6, updatedAt: Date.now() - DAY,
    },
    {
      id: 'p-linen', name: 'Linen Weekend Shirt', description: 'Garment-washed European linen, boxy fit.',
      category: 'Apparel', subcategory: 'Shirts', status: 'published',
      price: '58.00', compareAtPrice: '72.00', featured: false, tags: ['Sale'],
      createdAt: Date.now() - DAY * 18, updatedAt: Date.now() - DAY * 4,
    },
    {
      id: 'p-almanac', name: "The Maker's Almanac", description: 'A year of workshop notes, jigs, and material tables.',
      category: 'Books', subcategory: 'Non-fiction', status: 'archived',
      price: '24.00', compareAtPrice: '', featured: false, tags: ['Clearance'],
      createdAt: Date.now() - DAY * 90, updatedAt: Date.now() - DAY * 25,
    },
  ],

  inventory: [
    { id: 'i-aur', productId: 'p-aurora', sku: 'AUR-BLK', location: 'Main Warehouse', onHand: 48, reserved: 6, reorderPoint: 20 },
    { id: 'i-trl', productId: 'p-trailhead', sku: 'TRL-30-GRN', location: 'Main Warehouse', onHand: 12, reserved: 2, reorderPoint: 15 },
    { id: 'i-ter', productId: 'p-terracotta', sku: 'TER-SET3', location: 'Store Front', onHand: 0, reserved: 0, reorderPoint: 8 },
    { id: 'i-lin', productId: 'p-linen', sku: 'LIN-WK-M', location: 'Main Warehouse', onHand: 120, reserved: 10, reorderPoint: 30 },
    { id: 'i-alm', productId: 'p-almanac', sku: 'ALM-2E', location: 'Returns Bin', onHand: 5, reserved: 0, reorderPoint: 10 },
  ],

  media: [
    { id: 'm-1', name: 'aurora-hero.png', previewUrl: swatch('#1f2937', 'aurora-hero'), size: 421000, description: 'Aurora headphones on a desk', createdAt: Date.now() - DAY * 12 },
    { id: 'm-2', name: 'aurora-detail.png', previewUrl: swatch('#334155', 'aurora-detail'), size: 288000, description: 'Earcup hinge close-up', createdAt: Date.now() - DAY * 12 },
    { id: 'm-3', name: 'trailhead-lifestyle.jpg', previewUrl: swatch('#3f6212', 'trailhead-lifestyle'), size: 515000, description: 'Backpack on a trail', createdAt: Date.now() - DAY * 9 },
    { id: 'm-4', name: 'linen-packshot.webp', previewUrl: swatch('#7c5e48', 'linen-packshot'), size: 203000, description: 'Folded linen shirt', createdAt: Date.now() - DAY * 4 },
  ],

  promotions: [
    { id: 'pr-1', code: 'WELCOME10', type: 'percent', value: '10', appliesTo: 'order', category: '', startDate: iso(-30), endDate: iso(90), minSpend: '0', usageLimit: '500', eligibility: 'first', canStack: false, active: true, uses: 214 },
    { id: 'pr-2', code: 'SUMMER25', type: 'percent', value: '25', appliesTo: 'category', category: 'Apparel', startDate: iso(14), endDate: iso(45), minSpend: '50', usageLimit: '0', eligibility: 'all', canStack: false, active: true, uses: 0 },
    { id: 'pr-3', code: 'FREESHIP', type: 'shipping', value: '', appliesTo: 'order', category: '', startDate: iso(-120), endDate: iso(-30), minSpend: '35', usageLimit: '0', eligibility: 'all', canStack: true, active: false, uses: 1320 },
  ],

  settings: {
    storeName: 'Northlight Goods',
    supportEmail: 'help@northlight.example',
    description: 'Independent shop for everyday, well-made things.',
    logo: null,
    timezone: 'America/New_York',
    currency: 'USD',
    weightUnit: 'kg',
    taxMode: 'exclusive',
    requirePhone: false,
    guestCheckout: true,
    orderNote: true,
    notifyNewOrder: true,
    notifyLowStock: true,
    notifyRefund: false,
    notifyWeekly: false,
    shippingZones: [
      { id: 'z-1', name: 'Domestic', countries: ['United States'], rate: '5.00' },
      { id: 'z-2', name: 'International', countries: ['Canada', 'United Kingdom', 'Germany'], rate: '18.00' },
    ],
  },
};

function iso(daysFromNow) {
  return new Date(Date.now() + daysFromNow * DAY).toISOString().slice(0, 10);
}

export const promoStatus = (p) => {
  if (!p.active) return 'inactive';
  const today = new Date().toISOString().slice(0, 10);
  if (p.startDate && today < p.startDate) return 'scheduled';
  if (p.endDate && today > p.endDate) return 'expired';
  return 'active';
};

export const emptyProduct = (over = {}) => ({
  id: uid(), name: '', description: '', category: '', subcategory: '',
  status: 'draft', price: '', compareAtPrice: '', featured: false, tags: [],
  createdAt: Date.now(), updatedAt: Date.now(), ...over,
});

export const emptyPromo = (over = {}) => ({
  id: uid(), code: '', type: 'percent', value: '', appliesTo: 'order', category: '',
  startDate: '', endDate: '', minSpend: '', usageLimit: '', eligibility: 'all',
  canStack: false, active: true, uses: 0, ...over,
});
