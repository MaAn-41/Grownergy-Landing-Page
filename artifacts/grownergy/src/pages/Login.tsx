import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { LogIn, AlertCircle, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage, isErpnextConfigured } from "@/lib/api";

/**
 * Login page — uses ERPNext's `/api/method/login` via AuthContext.
 * On success it returns the user to the page they were trying to reach
 * (the `next` query param), defaulting to /products.
 */
export default function Login() {
  const { login } = useAuth();
  const [location, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Lightweight client-side validation
  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const passwordValid = password.length >= 1;
  const formValid = emailValid && passwordValid;

  const getNext = () => {
    const search = location.includes("?") ? location.split("?")[1] : "";
    const params = new URLSearchParams(search);
    return params.get("next") ?? "/products";
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!formValid) return;

    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate(decodeURIComponent(getNext()));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Sun className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">Grownergy</span>
        </Link>

        <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log in to view your cart and orders.
          </p>

          {!isErpnextConfigured && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-sm">
              <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                ERPNext URL is not configured. Set <code>VITE_ERPNEXT_URL</code>.
              </span>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <span className="text-destructive">{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@company.com"
                className="mt-1.5"
                required
              />
              {touched.email && !emailValid && (
                <p className="text-xs text-destructive mt-1">Enter a valid email.</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className="mt-1.5"
                required
              />
              {touched.password && !passwordValid && (
                <p className="text-xs text-destructive mt-1">Password is required.</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting || !formValid}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Signing in
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Log In
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
