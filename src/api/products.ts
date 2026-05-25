import { apiFetch, USE_FALLBACK, ApiError } from "./client";
import type { Category, Product } from "@/types/product";
import { fallbackProducts, fallbackCategories } from "@/data/fallback";

/**
 * Laravel returns snake_case keys (ios_model). The frontend uses camelCase
 * (iosModel). This adapter normalizes a single product payload so the rest
 * of the UI is agnostic to backend naming.
 */
type RawProduct = Omit<Product, "id" | "iosModel"> & {
  id: number | string;
  ios_model?: string | null;
  iosModel?: string | null;
};

function normalize(raw: RawProduct): Product {
  return {
    ...raw,
    id: String(raw.id),
    iosModel: raw.iosModel ?? raw.ios_model ?? undefined,
  } as Product;
}

/** GET /api/products */
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await apiFetch<RawProduct[]>("/products");
    return data.map(normalize);
  } catch (err) {
    if (USE_FALLBACK) return fallbackProducts;
    throw err as ApiError;
  }
}

/** GET /api/products/{id} */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await apiFetch<RawProduct>(`/products/${encodeURIComponent(id)}`);
    return normalize(data);
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
