import { Link } from "react-router-dom";
import { ArrowRight, Box, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { fetchProducts, categories, type Category, type Product } from "@/data/products";
import { useAR } from "@/context/ar";
import heroImg from "@/assets/hero-living.jpg";

const Home = () => {
  const { openAR } = useAR();
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<Category | "All">("All");

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-32">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AR Preview · See it in your space
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Visualize Furniture<br />in Your Space
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Considered pieces for slow living. Place every sofa, chair and table in your room before you decide — right from your phone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-smooth hover:scale-[1.02] hover:shadow-elegant"
              >
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => products[0] && openAR(products[0])}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-6 py-3.5 text-sm font-medium text-foreground transition-smooth hover:bg-background"
              >
                <Box className="h-4 w-4" /> Try AR demo
              </button>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="overflow-hidden rounded-3xl shadow-elegant">
              <img
                src={heroImg}
                alt="Sunlit minimalist living room with a beige modern sofa and round wooden coffee table"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-background p-4 shadow-elegant sm:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Featured</p>
              <p className="font-display text-lg text-foreground">Linen Three-Seater</p>
              <p className="text-sm text-muted-foreground">$1,890</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured + filters */}
      <section className="container py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Featured</p>
            <h2 className="mt-2 font-display text-4xl text-foreground md:text-5xl">
              New for the season
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
                active === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} onViewAR={openAR} />
          ))}
        </div>
      </section>

      {/* AR feature strip */}
      <section className="container pb-20">
        <div className="grid gap-8 rounded-3xl bg-foreground p-10 text-background md:grid-cols-2 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-background/60">Built-in AR</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Place it in your room — before you commit.
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-4 text-background/80">
            <p>
              Every Maison piece comes with a true-to-scale 3D model. Tap <span className="font-medium text-background">View in AR</span> on any product to walk around it in your living room.
            </p>
            <Link
              to="/shop"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition-smooth hover:scale-[1.02]"
            >
              Browse the collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
