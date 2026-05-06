/**
 * @deprecated Compatibility shim.
 * The app now fetches from the Laravel API via `src/api/products.ts`.
 * This file re-exports the same surface so existing imports keep working.
 */
export type { Category, Product } from "@/types/product";
export { fallbackProducts as products, fallbackCategories as categories } from "./fallback";
export { getProducts as fetchProducts, getProduct as fetchProduct } from "@/api/products";
