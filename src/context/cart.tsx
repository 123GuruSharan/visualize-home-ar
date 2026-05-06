/**
 * Cart context — API-ready.
 *
 * Behaviour:
 * - Tries the Laravel cart endpoints first (`src/api/cart.ts`).
 * - On any network/API failure (e.g. running the preview without a backend),
 *   transparently falls back to a localStorage cart so the UI stays usable.
 *
 * Once your Laravel backend is up and `VITE_USE_FALLBACK_DATA=false`,
 * remove the local branch and trust the API exclusively.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as cartApi from "@/api/cart";
import { getProduct } from "@/api/products";
import type { CartItem, CartSummary, Product } from "@/types/product";

interface CartContextValue extends CartSummary {
  loading: boolean;
  count: number;
  add: (product: Product, quantity?: number) => Promise<void>;
  remove: (itemId: CartItem["id"]) => Promise<void>;
  setQuantity: (itemId: CartItem["id"], quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const LOCAL_KEY = "maison.cart";

function readLocal(): { product_id: string; quantity: number }[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeLocal(rows: { product_id: string; quantity: number }[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
}

async function hydrateLocal(): Promise<CartSummary> {
  const rows = readLocal();
  const items: CartItem[] = [];
  for (const row of rows) {
    const product = await getProduct(row.product_id);
    if (product) items.push({ id: row.product_id, product, quantity: row.quantity });
  }
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return { items, subtotal: Math.round(subtotal * 100) / 100 };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setItems(data.items);
      setSubtotal(data.subtotal);
    } catch {
      const data = await hydrateLocal();
      setItems(data.items);
      setSubtotal(data.subtotal);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback<CartContextValue["add"]>(
    async (product, quantity = 1) => {
      try {
        await cartApi.addToCart(product.id, quantity);
      } catch {
        const rows = readLocal();
        const existing = rows.find((r) => r.product_id === product.id);
        if (existing) existing.quantity += quantity;
        else rows.push({ product_id: product.id, quantity });
        writeLocal(rows);
      }
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback<CartContextValue["remove"]>(
    async (itemId) => {
      try {
        await cartApi.removeCartItem(itemId);
      } catch {
        writeLocal(readLocal().filter((r) => r.product_id !== itemId));
      }
      await refresh();
    },
    [refresh]
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    async (itemId, quantity) => {
      if (quantity <= 0) return remove(itemId);
      try {
        await cartApi.updateCartItem(itemId, quantity);
      } catch {
        const rows = readLocal();
        const row = rows.find((r) => r.product_id === itemId);
        if (row) row.quantity = quantity;
        writeLocal(rows);
      }
      await refresh();
    },
    [refresh, remove]
  );

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    subtotal,
    loading,
    count,
    add,
    remove,
    setQuantity,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
