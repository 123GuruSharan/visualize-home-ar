import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background font-sans text-sm font-semibold">M</span>
          Maison
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-smooth ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative hidden rounded-full p-2.5 text-foreground transition-smooth hover:bg-muted md:inline-flex"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                {count}
              </span>
            )}
          </Link>

          {!loading && (user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                <UserIcon className="h-3.5 w-3.5" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="rounded-full p-2.5 text-foreground transition-smooth hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-smooth hover:scale-[1.02]"
              >
                Register
              </Link>
            </div>
          ))}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-2.5 text-foreground transition-smooth hover:bg-muted md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden" aria-label="Mobile">
          <div className="container flex flex-col py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-base font-medium transition-smooth ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="inline-flex items-center gap-2 py-2 text-base font-medium text-foreground"
                >
                  <LogOut className="h-4 w-4" /> Logout ({user.name})
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="py-2 text-base font-medium text-foreground">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="py-2 text-base font-medium text-foreground">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
