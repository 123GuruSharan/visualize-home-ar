import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useCart } from "@/context/cart";

const Cart = () => {
  const { items, subtotal, loading, setQuantity, remove } = useCart();

  if (loading) {
    return (
      <Layout>
        <div className="container grid min-h-[60vh] place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
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
  }

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <h1 className="font-display text-4xl text-foreground md:text-5xl">Your cart</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                <Link
                  to={`/product/${item.product.id}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-28 sm:w-28"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {item.product.category}
                      </p>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-display text-lg text-foreground hover:underline"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <p className="font-display text-lg text-foreground">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        aria-label="Decrease"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="grid h-9 w-9 place-items-center text-foreground transition-smooth hover:bg-muted rounded-l-full"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="grid h-9 w-9 place-items-center text-foreground transition-smooth hover:bg-muted rounded-r-full"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-smooth hover:text-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl text-foreground">Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="text-foreground">${subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-foreground">Free</dd>
              </div>
            </dl>
            <div className="mt-5 flex justify-between border-t border-border pt-5">
              <span className="font-display text-lg text-foreground">Total</span>
              <span className="font-display text-lg text-foreground">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <button className="mt-6 w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-smooth hover:scale-[1.01]">
              Checkout
            </button>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
