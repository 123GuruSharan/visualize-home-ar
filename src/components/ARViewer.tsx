import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { X, Loader2, Smartphone, AlertTriangle, RotateCw } from "lucide-react";

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

type LoadState = "loading" | "ready" | "error";

const ARViewer = ({ product, open, onClose }: ARViewerProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<LoadState>("loading");
  const [retryKey, setRetryKey] = useState(0);

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

  // Reset state whenever the product (or retry) changes
  useEffect(() => {
    if (!open) return;
    setProgress(0);
    setStatus("loading");
  }, [open, product?.id, retryKey]);

  // Attach <model-viewer> event listeners imperatively (custom element events)
  useEffect(() => {
    if (!open || !product) return;
    const el = document.getElementById("ar-model-viewer") as HTMLElement | null;
    if (!el) return;

    // Safety net: if the model never reports progress/load, surface an error
    const timeout = window.setTimeout(() => {
      setStatus((s) => (s === "loading" ? "error" : s));
    }, 20000);

    const onProgress = (e: Event) => {
      // @ts-expect-error custom event detail
      const t = e.detail?.totalProgress;
      if (typeof t === "number") {
        setProgress(Math.round(t * 100));
      }
    };
    const onLoad = () => {
      setProgress(100);
      setStatus("ready");
      window.clearTimeout(timeout);
    };
    const onError = () => {
      setStatus("error");
      window.clearTimeout(timeout);
    };

    el.addEventListener("progress", onProgress);
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      window.clearTimeout(timeout);
    };
  }, [open, product, retryKey]);

  if (!open || !product) return null;

  const handleRetry = () => setRetryKey((k) => k + 1);

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
          {/* Loading overlay */}
          {status === "loading" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-surface/90 backdrop-blur-sm animate-fade-in">
              <Loader2 className="h-9 w-9 animate-spin text-foreground" />
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-foreground">Preparing 3D model…</p>
                <p className="text-xs text-muted-foreground">This may take a few seconds</p>
              </div>
              <div
                className="h-1.5 w-56 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-foreground transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
              <p className="text-xs tabular-nums text-muted-foreground">{progress}%</p>
            </div>
          )}

          {/* Error overlay */}
          {status === "error" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-surface/95 px-6 text-center backdrop-blur-sm animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-lg text-foreground">Couldn't load 3D model</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  The model failed to load. Check your connection and try again, or continue browsing the product.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-elegant transition-smooth hover:scale-105"
                >
                  <RotateCw className="h-4 w-4" />
                  Try again
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {status !== "error" && (
            <model-viewer
              key={retryKey}
              id="ar-model-viewer"
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
          )}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            {status === "ready"
              ? <>Drag to rotate · Pinch to zoom · Tap <span className="font-medium text-foreground">View in your room</span> on mobile to place it in AR.</>
              : status === "loading"
              ? "Loading high-quality 3D assets…"
              : "Model unavailable right now."}
          </p>
          <p className="font-display text-xl text-foreground">${product.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
