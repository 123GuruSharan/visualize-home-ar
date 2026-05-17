import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/api/client";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (password !== confirm) next.password_confirmation = "Passwords do not match";
    if (Object.keys(next).length) return setErrors(next);

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirm,
      });
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { errors?: Record<string, string[]>; message?: string };
        if (body?.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(body.errors)) flat[k] = v[0];
          setErrors(flat);
        } else {
          toast.error(body?.message ?? "Registration failed");
        }
      } else {
        toast.error("Network error. Is the Laravel backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (id: string, label: string, value: string, setter: (v: string) => void, type = "text", autoComplete?: string) => (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {errors[id] && <p className="mt-1 text-xs text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <Layout>
      <section className="container grid min-h-[70vh] place-items-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="font-display text-3xl text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Maison to save your cart and AR favourites.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            {field("name", "Name", name, setName, "text", "name")}
            {field("email", "Email", email, setEmail, "email", "email")}

            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
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
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            {field("password_confirmation", "Confirm password", confirm, setConfirm, showPwd ? "text" : "password", "new-password")}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-smooth hover:scale-[1.01] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
