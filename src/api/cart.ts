import { apiFetch } from "./client";
import type { CartSummary } from "@/types/product";

/** Generates / retrieves a guest session id for the cart. */
export function getSessionId(): string {
  const KEY = "maison.session";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** GET /api/cart?session={uuid} */
export function getCart(): Promise<CartSummary> {
  return apiFetch<CartSummary>(`/cart?session=${getSessionId()}`);
}

/** POST /api/cart/add */
export function addToCart(productId: string, quantity = 1) {
  return apiFetch(`/cart/add`, {
    method: "POST",
    body: { session_id: getSessionId(), product_id: productId, quantity },
  });
}

/** PATCH /api/cart/{id} */
export function updateCartItem(itemId: number | string, quantity: number) {
  return apiFetch(`/cart/${itemId}`, {
    method: "PATCH",
    body: { quantity },
  });
}

/** DELETE /api/cart/remove/{id} */
export function removeCartItem(itemId: number | string) {
  return apiFetch(`/cart/remove/${itemId}`, { method: "DELETE" });
}
