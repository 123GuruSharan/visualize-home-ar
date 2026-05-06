import { apiFetch, USE_FALLBACK, ApiError } from "./client";
import type { Category, Product } from "@/types/product";
import { fallbackProducts, fallbackCategories } from "@/data/fallback";

/** GET /api/products */
export async function getProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>("/products");
  } catch (err) {
    if (USE_FALLBACK) return fallbackProducts;
    throw err as ApiError;
  }
}

/** GET /api/products/{id} */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    if (USE_FALLBACK) return fallbackProducts.find((p) => p.id === id) ?? null;
    throw err;
  }
}

/** GET /api/categories */
export async function getCategories(): Promise<Category[]> {
  try {
    return await apiFetch<Category[]>("/categories");
  } catch (err) {
    if (USE_FALLBACK) return fallbackCategories;
    throw err as ApiError;
  }
}
