import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ARViewer from "./ARViewer";
import type { Product } from "@/data/products";
import { ARContext } from "@/context/ar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [arProduct, setArProduct] = useState<Product | null>(null);

  return (
    <ARContext.Provider value={{ openAR: setArProduct }}>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ARViewer product={arProduct} open={!!arProduct} onClose={() => setArProduct(null)} />
      </div>
    </ARContext.Provider>
  );
};

export default Layout;
