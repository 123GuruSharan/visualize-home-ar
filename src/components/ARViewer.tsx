import { useEffect } from "react";
import type { Product } from "@/data/products";
import { X, Loader2, Smartphone } from "lucide-react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          exposure?: string;
          poster?: string;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface ARViewerProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ARViewer = ({ product, open, onClose }: ARViewerProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`AR preview of ${product.name}`}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-background shadow-elegant animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">AR Preview</p>
            <h3 className="font-display text-2xl text-foreground">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close AR preview"
            className="rounded-full p-2 text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full bg-surface md:aspect-[16/10]">
          {/* Loading shimmer behind the model */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Preparing 3D model…</p>
          </div>

          <model-viewer
            src={product.model}
            ios-src={product.iosModel}
            alt={`3D model of ${product.name}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            loading="eager"
            reveal="auto"
            style={{ width: "100%", height: "100%", background: "transparent", position: "relative", zIndex: 1 }}
          >
            <button
              slot="ar-button"
              className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-elegant transition-smooth hover:scale-105"
            >
              <Smartphone className="h-4 w-4" />
              View in your room
            </button>
          </model-viewer>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Drag to rotate · Pinch to zoom · Tap <span className="font-medium text-foreground">View in your room</span> on mobile to place it in AR.
          </p>
          <p className="font-display text-xl text-foreground">${product.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
