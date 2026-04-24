import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, ShoppingCart, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { count } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Section anchors on the landing page
  const sectionLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Contact", id: "contact" },
  ];

  // Routed pages (the storefront)
  const pageLinks = [
    { name: "Products", href: "/products" },
  ];

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Sun className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight font-display text-foreground">
              Grownergy
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {sectionLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </button>
              ))}
              {pageLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Cart icon with badge */}
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {/* Auth state */}
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full"
                  title={user.email}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Log out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="rounded-full"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Login
                </Button>
              )}

              <Button
                onClick={() => scrollTo("contact")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                Get a Quote
              </Button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-3">
          {sectionLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-left py-2 text-foreground font-medium"
            >
              {link.name}
            </button>
          ))}
          {pageLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 text-foreground font-medium"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="text-left py-2 text-foreground font-medium flex items-center gap-2"
          >
            Cart
            {count > 0 && (
              <span className="text-xs text-muted-foreground">({count})</span>
            )}
          </Link>
          {user ? (
            <Button variant="outline" onClick={handleLogout} className="w-full rounded-full mt-2">
              <User className="w-4 h-4 mr-1.5" />
              Log out
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="w-full rounded-full mt-2"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Login
            </Button>
          )}
          <Button onClick={() => scrollTo("contact")} className="w-full rounded-full">
            Get a Quote
          </Button>
        </div>
      )}
    </nav>
  );
}
