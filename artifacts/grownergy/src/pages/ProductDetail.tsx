import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, ShoppingCart, AlertCircle, ShoppingBag, Plus, Minus } from "lucide-react";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { Button } from "@/components/ui/button";
import { fetchItem, resolveImageUrl, type ErpnextItem } from "@/lib/erpnext";
import { getErrorMessage } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

/**
 * Product Detail page — `GET /api/resource/Item/{name}`.
 * Adds the item (with chosen quantity) to the localStorage cart.
 */
export default function ProductDetail() {
  const params = useParams<{ name: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();

  const [item, setItem] = useState<ErpnextItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItem(decodeURIComponent(params.name))
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.name]);

  const handleAdd = () => {
    if (!item) return;
    addItem(
      {
        id: item.name,
        name: item.item_name,
        price: item.standard_rate ?? 0,
        image: resolveImageUrl(item.image),
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </button>

          {loading && <DetailSkeleton />}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Couldn't load this product</p>
                <p className="text-muted-foreground">{error}</p>
                <Link href="/products" className="inline-block mt-2 text-primary underline">
                  Back to products
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && item && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="rounded-2xl bg-muted overflow-hidden aspect-square flex items-center justify-center border border-border/60">
                {resolveImageUrl(item.image) ? (
                  <img
                    src={resolveImageUrl(item.image)!}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="w-20 h-20 text-muted-foreground/40" />
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {item.item_group ?? item.brand ?? "Product"}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {item.item_name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Item code: <span className="font-mono">{item.item_code}</span>
                </p>

                <p className="mt-6 text-3xl font-bold text-primary">
                  {item.standard_rate
                    ? `$${item.standard_rate.toFixed(2)}`
                    : "Contact for price"}
                  {item.stock_uom && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      / {item.stock_uom}
                    </span>
                  )}
                </p>

                {item.description && (
                  <div
                    className="mt-6 text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      type="button"
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-l-full"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{qty}</span>
                    <button
                      type="button"
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-r-full"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAdd}
                    size="lg"
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {added ? "Added!" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="aspect-square bg-muted animate-pulse rounded-2xl" />
      <div className="space-y-4">
        <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-6 w-1/3 bg-muted animate-pulse rounded mt-6" />
        <div className="h-4 w-full bg-muted animate-pulse rounded mt-6" />
        <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
