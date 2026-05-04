import { Link } from "react-router-dom";
import { Box } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onViewAR: (product: Product) => void;
}

const ProductCard = ({ product, onViewAR }: ProductCardProps) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-hover">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-surface">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product.id}`} className="font-display text-lg leading-tight text-foreground transition-smooth hover:text-accent">
            {product.name}
          </Link>
          <span className="shrink-0 font-display text-lg text-foreground">
            ${product.price.toLocaleString()}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onViewAR(product);
          }}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-smooth hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <Box className="h-4 w-4" />
          View in AR
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
