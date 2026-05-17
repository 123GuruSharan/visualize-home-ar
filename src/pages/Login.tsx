import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/api/client";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const redirectTo = location.state?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required";
    if (!password) next.password = "Password is required";
    if (Object.keys(next).length) return setErrors(next);

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success("Welcome back");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { errors?: Record<string, string[]>; message?: string };
        if (body?.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(body.errors)) flat[k] = v[0];
          setErrors(flat);
        } else if (err.status === 401 || err.status === 422) {
          setErrors({ email: "Invalid credentials" });
        } else {
          toast.error(body?.message ?? "Login failed");
        }
      } else {
        toast.error("Network error. Is the Laravel backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container grid min-h-[70vh] place-items-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-3xl text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back to Maison.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-smooth hover:scale-[1.01] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="font-medium text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
