import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Layout from "@/components/Layout";

const Cart = () => (
  <Layout>
    <section className="container py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface">
          <ShoppingBag className="h-7 w-7 text-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-foreground">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Browse the collection and place pieces in your room with AR before adding them here.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition-smooth hover:scale-[1.02]"
        >
          Shop the collection
        </Link>
      </div>
    </section>
  </Layout>
);

export default Cart;
