import { Link, useLocation } from "wouter";
import { ShoppingCart, LogIn, LogOut, User, Menu, X, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

/**
 * Top navigation for the storefront pages (/products, /cart, etc.).
 * Kept separate from the marketing landing navbar so each can evolve
 * independently.
 */
export function ShopNavbar() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Cart", href: "/cart" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sun className="w-7 h-7 text-primary" />
          <span className="text-lg font-bold tracking-tight">Grownergy</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4 mr-1.5" />
                Log out
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/login")}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground font-medium"
              >
                {l.name}
                {l.href === "/cart" && count > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">({count})</span>
                )}
              </Link>
            ))}
            {user ? (
              <Button variant="outline" onClick={handleLogout} className="rounded-full">
                Log out ({user.email})
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
