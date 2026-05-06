export type Category = "Sofa" | "Chair" | "Table" | "Bed";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  dimensions: { width: number; height: number; depth: number };
  /** GLB 3D model — used by <model-viewer> */
  model: string;
  /** USDZ for iOS Quick Look (optional) */
  iosModel?: string;
}

export interface CartItem {
  id: number | string;
  product: Product;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
}
