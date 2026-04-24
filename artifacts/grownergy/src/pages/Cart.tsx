import { Link, useLocation } from "wouter";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Cart page (protected route — wrapped by ProtectedRoute in App.tsx).
 * The cart itself lives in localStorage; checkout is left as a stub
 * since order creation depends on the customer's ERPNext setup.
 */
export default function Cart() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ShopNavbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-md mx-auto text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Your cart is empty</h1>
              <p className="text-muted-foreground mt-2">
                Browse our solar catalog and add a few items to get started.
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="mt-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Shop Products
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Cart</h1>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">Signed in as {user.email}</p>
              )}
            </div>
            <button
              onClick={clear}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl border border-border/60 bg-card"
                >
                  <Link
                    href={`/products/${encodeURIComponent(item.id)}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link
                      href={`/products/${encodeURIComponent(item.id)}`}
                      className="font-semibold text-foreground hover:text-primary line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      ${item.price.toFixed(2)} each
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-l-full"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-r-full"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="text-lg font-semibold tracking-tight">Order Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-4 pt-4 border-t border-border flex justify-between text-base font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button
                onClick={() => alert("Checkout would create a Sales Order in ERPNext.")}
                className="w-full mt-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Checkout
              </Button>
              <Link
                href="/products"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-3"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
