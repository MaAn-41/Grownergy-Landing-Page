import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 5 minute cache

const getFromCache = (key: string) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};

const setCache = (key: string, data: unknown) => {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
};

const getErpHeaders = () => {
  const apiKey = process.env["ERPNEXT_API_KEY"];
  const apiSecret = process.env["ERPNEXT_API_SECRET"];
  return {
    "Content-Type": "application/json",
    Authorization: `token ${apiKey}:${apiSecret}`,
  };
};

const getErpUrl = (path: string) => {
  const base = (process.env["ERPNEXT_URL"] ?? "").replace(/\/$/, "");
  return `${base}${path}`;
};

// GET /api/items — sab items (cache ke saath)
router.get("/items", async (req, res) => {
  try {
    const { search, limit = "50" } = req.query as { search?: string; limit?: string };

    const cacheKey = `items:${search ?? ""}:${limit}`;

    // Cache check
    const cached = getFromCache(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      res.json({ data: cached });
      return;
    }

    const fields = JSON.stringify([
      "name", "item_code", "item_name", "description",
      "image", "standard_rate", "stock_uom", "item_group", "brand", "disabled",
    ]);

    const filters: Array<[string, string, string | number]> = [["disabled", "=", 0]];
    if (search) {
      filters.push(["item_name", "like", `%${search}%`]);
    }

    const params = new URLSearchParams({
      fields,
      filters: JSON.stringify(filters),
      limit_page_length: limit,
      order_by: "modified desc",
    });

    const erpRes = await fetch(getErpUrl(`/api/resource/Item?${params}`), {
      headers: getErpHeaders(),
    });

    if (!erpRes.ok) {
      const err = await erpRes.json().catch(() => ({}));
      console.error("ERPNext items error:", err);
      res.status(502).json({ error: "Items fetch karne mein masla aaya" });
      return;
    }

    const data = await erpRes.json() as { data: unknown[] };

    // Cache mein save karo
    setCache(cacheKey, data.data);

    res.setHeader("X-Cache", "MISS");
    res.json({ data: data.data });
  } catch (err) {
    console.error("Items route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/items/:name — single item (cache ke saath)
router.get("/items/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const cacheKey = `item:${name}`;

    const cached = getFromCache(cacheKey);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      res.json({ data: cached });
      return;
    }

    const erpRes = await fetch(
      getErpUrl(`/api/resource/Item/${encodeURIComponent(name)}`),
      { headers: getErpHeaders() }
    );

    if (!erpRes.ok) {
      const err = await erpRes.json().catch(() => ({}));
      console.error("ERPNext item error:", err);
      res.status(erpRes.status === 404 ? 404 : 502).json({ error: "Item nahi mila" });
      return;
    }

    const data = await erpRes.json() as { data: unknown };

    setCache(cacheKey, data.data);

    res.setHeader("X-Cache", "MISS");
    res.json({ data: data.data });
  } catch (err) {
    console.error("Item route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
