import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Box, ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import Layout from "@/components/Layout";
import { fetchProduct, type Product } from "@/data/products";
import { useAR } from "@/context/ar";

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card px-4 py-3">
    <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="mt-1 font-display text-lg text-foreground">{value}</p>
  </div>
);

const ProductDetail = () => {
  const { id = "" } = useParams();
  const { openAR } = useAR();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    fetchProduct(id).then((p) => setProduct(p ?? null));
  }, [id]);

  if (product === undefined) {
    return (
      <Layout>
        <div className="container grid min-h-[60vh] place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (product === null) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="font-display text-4xl text-foreground">Not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-sm underline">Back to shop</Link>
        </div>
      </Layout>
    );
  }

  const { dimensions: d } = product;

  return (
    <Layout>
      <section className="container py-10 md:py-14">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-smooth hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl bg-surface shadow-soft">
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-foreground md:text-5xl">{product.name}</h1>
            <p className="mt-4 font-display text-3xl text-foreground">${product.price.toLocaleString()}</p>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Dimensions</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <Detail label="Width" value={`${d.width} cm`} />
                <Detail label="Height" value={`${d.height} cm`} />
                <Detail label="Depth" value={`${d.depth} cm`} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => openAR(product)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-medium text-background transition-smooth hover:scale-[1.02] hover:shadow-elegant"
              >
                <Box className="h-4 w-4" /> View in AR
              </button>
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-4 text-sm font-medium text-foreground transition-smooth hover:border-foreground">
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free white-glove delivery</li>
              <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> 30-day returns</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 10-year warranty</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
