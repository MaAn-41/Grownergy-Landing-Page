import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, AlertCircle, RefreshCw } from "lucide-react";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { Input } from "@/components/ui/input";
import { fetchItems, resolveImageUrl, type ErpnextItem } from "@/lib/erpnext";
import { getErrorMessage, isErpnextConfigured } from "@/lib/api";

// ─── localStorage Cache ───────────────────────────────────────────────────────
const CACHE_KEY = "grownergy:products";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  data: ErpnextItem[];
  savedAt: number;
}

function readCache(): ErpnextItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.savedAt > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: ErpnextItem[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch {}
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}

// ─── Debounce Hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Lazy Image ───────────────────────────────────────────────────────────────
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <>
      {!loaded && !error && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
        </div>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ALL_TAB = "All";

export default function Products() {
  const [allItems, setAllItems] = useState<ErpnextItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revalidating, setRevalidating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_TAB);
  const [isStale, setIsStale] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // ─── Categories — item_group se nikalo ─────────────────────────────────
  const categories = useMemo(() => {
    const groups = allItems
      .map((i) => i.item_group)
      .filter((g): g is string => Boolean(g));
    const unique = Array.from(new Set(groups)).sort();
    return [ALL_TAB, ...unique];
  }, [allItems]);

  // ─── Filtered items ─────────────────────────────────────────────────────
  const displayedItems = useMemo(() => {
    let list = allItems;

    // Category filter
    if (activeCategory !== ALL_TAB) {
      list = list.filter((i) => i.item_group === activeCategory);
    }

    // Search filter (client-side jab search ho aur cache data ho)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (i) =>
          i.item_name.toLowerCase().includes(q) ||
          (i.item_group ?? "").toLowerCase().includes(q) ||
          (i.brand ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [allItems, activeCategory, debouncedSearch]);

  // ─── Initial load: stale-while-revalidate ──────────────────────────────
  useEffect(() => {
    const cached = readCache();

    if (cached && cached.length > 0) {
      setAllItems(cached);
      setLoading(false);
      setIsStale(true);

      setRevalidating(true);
      fetchItems({ limit: 200 })
        .then((fresh) => {
          setAllItems(fresh);
          writeCache(fresh);
          setIsStale(false);
        })
        .catch(() => setIsStale(false))
        .finally(() => setRevalidating(false));
    } else {
      fetchItems({ limit: 200 })
        .then((data) => {
          setAllItems(data);
          writeCache(data);
          setError(null);
        })
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoading(false));
    }
  }, []);

  // ─── Category change — reset search ────────────────────────────────────
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearch("");
  };

  // ─── Manual refresh ─────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    clearCache();
    setRevalidating(true);
    fetchItems({ limit: 200 })
      .then((data) => { setAllItems(data); writeCache(data); setError(null); })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setRevalidating(false));
  }, []);

  // Search loading indicator (client-side filter fast hai — sirf visual)
  const prevSearch = useRef("");
  useEffect(() => {
    if (debouncedSearch !== prevSearch.current) {
      prevSearch.current = debouncedSearch;
      setSearching(false);
    }
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen bg-background">
      <ShopNavbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground mt-1">
                Solar systems, components, and accessories — straight from our catalog.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={revalidating}
                title="Refresh products"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-4 h-4 ${revalidating ? "animate-spin" : ""}`} />
              </button>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {!isErpnextConfigured && <ConfigWarning />}
          {error && <ErrorBanner message={error} />}

          {revalidating && isStale && (
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Updating in background…</span>
            </div>
          )}

          {/* Category Tabs */}
          {!loading && categories.length > 1 && (
            <div className="mb-6 overflow-x-auto pb-1">
              <div className="flex gap-2 w-max">
                {categories.map((cat) => {
                  const count =
                    cat === ALL_TAB
                      ? allItems.length
                      : allItems.filter((i) => i.item_group === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {cat}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeCategory === cat
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <ProductSkeleton />
          ) : displayedItems.length === 0 ? (
            <EmptyState search={search} category={activeCategory} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {displayedItems.length} product{displayedItems.length !== 1 ? "s" : ""}
                {activeCategory !== ALL_TAB ? ` in "${activeCategory}"` : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-150 ${
                searching ? "opacity-60" : "opacity-100"
              }`}>
                {displayedItems.map((item) => (
                  <ProductCard key={item.name} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ item }: { item: ErpnextItem }) {
  const img = resolveImageUrl(item.image);
  const price = item.standard_rate ?? 0;

  return (
    <Link
      href={`/products/${encodeURIComponent(item.name)}`}
      className="group block rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-muted overflow-hidden relative flex items-center justify-center">
        {img ? (
          <LazyImage src={img} alt={item.item_name} />
        ) : (
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-4">
        {item.item_group && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 truncate">
            {item.item_group}
          </p>
        )}
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.75rem]">
          {item.item_name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">
          {price > 0 ? `PKR ${price.toLocaleString()}` : "Contact for price"}
        </p>
      </div>
    </Link>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function EmptyState({ search, category }: { search: string; category: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-border/60 rounded-2xl">
      <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-foreground font-medium">No products found</p>
      <p className="text-sm text-muted-foreground mt-1">
        {search
          ? `Nothing matched "${search}"${category !== ALL_TAB ? ` in "${category}"` : ""}.`
          : category !== ALL_TAB
          ? `No products in "${category}" category.`
          : "Your ERPNext catalog is empty."}
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
