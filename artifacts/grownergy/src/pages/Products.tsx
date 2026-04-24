import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, AlertCircle } from "lucide-react";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { Input } from "@/components/ui/input";
import { fetchItems, resolveImageUrl, type ErpnextItem } from "@/lib/erpnext";
import { getErrorMessage, isErpnextConfigured } from "@/lib/api";

/**
 * Product Listing Page.
 * Pulls items from `GET /api/resource/Item` with a small client-side
 * search box. Empty state, loading state, and error state are all
 * handled explicitly.
 */
export default function Products() {
  const [items, setItems] = useState<ErpnextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItems({ search: search.trim() || undefined, limit: 60 })
      .then((data) => {
        if (!cancelled) setItems(data);
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
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      <ShopNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground mt-1">
                Solar systems, components, and accessories — straight from our catalog.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="pl-9"
              />
            </div>
          </div>

          {!isErpnextConfigured && <ConfigWarning />}
          {error && <ErrorBanner message={error} />}

          {loading ? (
            <ProductSkeleton />
          ) : items.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ProductCard key={item.name} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProductCard({ item }: { item: ErpnextItem }) {
  const img = resolveImageUrl(item.image);
  const price = item.standard_rate ?? 0;
  return (
    <Link
      href={`/products/${encodeURIComponent(item.name)}`}
      className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-muted overflow-hidden flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={item.item_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 truncate">
          {item.item_group ?? item.brand ?? "Product"}
        </p>
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.75rem]">
          {item.item_name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">
          {price > 0 ? `$${price.toFixed(2)}` : "Contact for price"}
        </p>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="aspect-square bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-5 w-1/4 bg-muted animate-pulse rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-border/60 rounded-2xl">
      <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No products found</p>
      <p className="text-sm text-muted-foreground mt-1">
        {search ? `Nothing matched "${search}".` : "Your ERPNext catalog is empty."}
      </p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-destructive">Couldn't load products</p>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function ConfigWarning() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-yellow-700 dark:text-yellow-500">ERPNext URL is not configured</p>
        <p className="text-muted-foreground">
          Set the <code>VITE_ERPNEXT_URL</code> environment variable to your ERPNext instance.
        </p>
      </div>
    </div>
  );
}

