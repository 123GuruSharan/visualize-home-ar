import sofa from "@/assets/product-sofa.jpg";
import chair from "@/assets/product-chair.jpg";
import table from "@/assets/product-table.jpg";
import bed from "@/assets/product-bed.jpg";
import armchair from "@/assets/product-armchair.jpg";
import dining from "@/assets/product-dining.jpg";
import sectional from "@/assets/product-sectional.jpg";

export type Category = "Sofa" | "Chair" | "Table" | "Bed";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  dimensions: { width: number; height: number; depth: number }; // cm
  /** GLB 3D model — used by <model-viewer> */
  model: string;
  /** USDZ for iOS Quick Look (optional) */
  iosModel?: string;
}

// Free GLB samples from Google's <model-viewer> assets.
// Real catalog would point each item to its own model.
const SAMPLE_GLB =
  "https://modelviewer.dev/shared-assets/models/Chair.glb";
const SAMPLE_GLB_2 =
  "https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/AntiqueCamera/glTF-Binary/AntiqueCamera.glb";
const SAMPLE_USDZ =
  "https://modelviewer.dev/shared-assets/models/Chair.usdz";

export const products: Product[] = [
  {
    id: "linen-three-seater",
    name: "Linen Three-Seater",
    category: "Sofa",
    price: 1890,
    image: sofa,
    description:
      "A relaxed three-seater dressed in soft natural linen, with deep feather-blend cushions and solid oak legs. Made to settle into for a long afternoon.",
    dimensions: { width: 220, height: 84, depth: 92 },
    model: SAMPLE_GLB,
    iosModel: SAMPLE_USDZ,
  },
  {
    id: "oak-lounge-chair",
    name: "Oak Lounge Chair",
    category: "Chair",
    price: 740,
    image: chair,
    description:
      "Sculpted from solid oak with a generous cushioned seat. A quiet companion for the corner of any room.",
    dimensions: { width: 72, height: 78, depth: 76 },
    model: SAMPLE_GLB,
    iosModel: SAMPLE_USDZ,
  },
  {
    id: "round-oak-coffee",
    name: "Round Oak Coffee Table",
    category: "Table",
    price: 520,
    image: table,
    description:
      "A pure circular silhouette in honey-toned oak. Substantial, simple, and warm.",
    dimensions: { width: 90, height: 38, depth: 90 },
    model: SAMPLE_GLB_2,
  },
  {
    id: "linen-platform-bed",
    name: "Linen Platform Bed",
    category: "Bed",
    price: 1640,
    image: bed,
    description:
      "A low-profile upholstered bed with a soft linen headboard. Designed to feel grounded and calm.",
    dimensions: { width: 180, height: 110, depth: 215 },
    model: SAMPLE_GLB,
  },
  {
    id: "velvet-armchair",
    name: "Velvet Curve Armchair",
    category: "Chair",
    price: 890,
    image: armchair,
    description:
      "A curved silhouette in deep emerald velvet, balanced on tapered walnut legs.",
    dimensions: { width: 78, height: 82, depth: 80 },
    model: SAMPLE_GLB,
    iosModel: SAMPLE_USDZ,
  },
  {
    id: "walnut-dining",
    name: "Walnut Dining Table",
    category: "Table",
    price: 2150,
    image: dining,
    description:
      "A long walnut top supported by sculpted angled legs. Built to host.",
    dimensions: { width: 220, height: 75, depth: 95 },
    model: SAMPLE_GLB_2,
  },
  {
    id: "charcoal-sectional",
    name: "Charcoal Modular Sectional",
    category: "Sofa",
    price: 3290,
    image: sectional,
    description:
      "A modular L-shaped sectional in charcoal weave. Reconfigure as your space evolves.",
    dimensions: { width: 280, height: 80, depth: 220 },
    model: SAMPLE_GLB,
  },
];

export const categories: Category[] = ["Sofa", "Chair", "Table", "Bed"];

/** Fetch-ready helpers — swap baseURL for Laravel API later. */
const API = "/api"; // e.g. import.meta.env.VITE_API_URL

export async function fetchProducts(): Promise<Product[]> {
  // return fetch(`${API}/products`).then(r => r.json());
  return Promise.resolve(products);
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  // return fetch(`${API}/products/${id}`).then(r => r.json());
  return Promise.resolve(products.find((p) => p.id === id));
}
