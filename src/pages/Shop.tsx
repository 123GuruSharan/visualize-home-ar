import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, categories, type Category, type Product } from "@/data/products";
import { useAR } from "@/context/ar";

const Shop = () => {
  const { openAR } = useAR();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [maxPrice, setMaxPrice] = useState(3500);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, cat, maxPrice, query]);

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Shop</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">The collection</h1>
          <p className="mt-4 text-muted-foreground">
            Pieces designed to feel right at home. Every item includes an AR preview.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-6 md:p-5">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search furniture…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-smooth ${
                  cat === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="flex min-w-[200px] items-center gap-3 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="whitespace-nowrap">Up to ${maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min={500}
              max={3500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-foreground"
              aria-label="Maximum price"
            />
          </label>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No pieces match your filters.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onViewAR={openAR} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Shop;
