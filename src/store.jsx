import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SEED, emptyProduct, emptyPromo, uid } from './data';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const KEY = 'producthub:v2';

const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));

function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
const SAVED = loadSaved();
const init = (slice) => (SAVED && SAVED[slice] != null ? SAVED[slice] : clone(SEED[slice]));

const AUTH_KEY = 'producthub:auth';
export const DEMO_CREDS = { email: 'admin@northlight.example', password: 'admin123' };

const revokeImages = (p) => p && p.images.forEach((i) => URL.revokeObjectURL(i.previewUrl));

export function StoreProvider({ children }) {
  const [authed, setAuthed] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === '1';
    } catch {
      return false;
    }
  });

  const login = useCallback((email, password) => {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDS.email && password === DEMO_CREDS.password;
    if (ok) {
      try {
        localStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
      setAuthed(true);
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
  }, []);

  const [products, setProducts] = useState(() => init('products'));
  const [inventory, setInventory] = useState(() => init('inventory'));
  const [media, setMedia] = useState(() => init('media'));
  const [promotions, setPromotions] = useState(() => init('promotions'));
  const [settings, setSettings] = useState(() => init('settings'));

  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false });

  // persist every slice to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ products, inventory, media, promotions, settings })
      );
    } catch (e) {
      // quota exceeded (large images) or storage disabled — keep working in memory
      console.warn('ProductHub: could not persist to localStorage', e);
    }
  }, [products, inventory, media, promotions, settings]);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setProducts(clone(SEED.products));
    setInventory(clone(SEED.inventory));
    setMedia(clone(SEED.media));
    setPromotions(clone(SEED.promotions));
    setSettings(clone(SEED.settings));
  }, []);

  const clearToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ---- products ----
  const saveProduct = useCallback((p) => {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      const row = { ...p, updatedAt: Date.now() };
      return exists ? prev.map((x) => (x.id === p.id ? row : x)) : [{ ...emptyProduct(row) }, ...prev];
    });
  }, []);
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setInventory((prev) => prev.filter((i) => i.productId !== id));
  }, []);

  // ---- inventory ----
  const applyAdjustment = useCallback(({ productId, location, mode, quantity, reorderPoint, sku }) => {
    const qty = Number(quantity) || 0;
    setInventory((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId && i.location === location);
      if (idx === -1) {
        return [
          ...prev,
          {
            id: uid(),
            productId,
            location,
            sku: sku || 'NEW-SKU',
            onHand: mode === 'remove' ? 0 : qty,
            reserved: 0,
            reorderPoint: Number(reorderPoint) || 0,
          },
        ];
      }
      return prev.map((i, k) => {
        if (k !== idx) return i;
        let onHand = i.onHand;
        if (mode === 'set') onHand = qty;
        if (mode === 'add') onHand = i.onHand + qty;
        if (mode === 'remove') onHand = Math.max(0, i.onHand - qty);
        return {
          ...i,
          onHand,
          reorderPoint:
            reorderPoint === '' || reorderPoint == null ? i.reorderPoint : Number(reorderPoint),
        };
      });
    });
  }, []);

  // ---- media ----
  const addMedia = useCallback((items) => {
    setMedia((prev) => [...items, ...prev]);
  }, []);
  const updateMedia = useCallback((id, partial) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  }, []);
  const deleteMedia = useCallback((id) => {
    setMedia((prev) => {
      const m = prev.find((x) => x.id === id);
      if (m && m.previewUrl && m.previewUrl.startsWith('blob:')) URL.revokeObjectURL(m.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  // ---- promotions ----
  const savePromotion = useCallback((p) => {
    setPromotions((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? { ...p } : x)) : [{ ...emptyPromo(p) }, ...prev];
    });
  }, []);
  const deletePromotion = useCallback((id) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---- settings ----
  const saveSettings = useCallback((next) => setSettings(next), []);

  const value = {
    authed, login, logout,
    products, saveProduct, deleteProduct,
    inventory, applyAdjustment,
    media, addMedia, updateMedia, deleteMedia,
    promotions, savePromotion, deletePromotion,
    settings, saveSettings,
    toast, showToast, clearToast,
    confirmState, setConfirmState,
    resetAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
