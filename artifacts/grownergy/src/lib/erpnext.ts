import { api } from "./api";

/**
 * ERPNext service layer.
 *
 * Sab requests Express backend ke through jaati hain — API keys
 * server pe safe rehti hain, browser mein expose nahi hoti.
 */

export interface ErpnextItem {
  name: string;
  item_code: string;
  item_name: string;
  description?: string;
  image?: string;
  standard_rate?: number;
  stock_uom?: string;
  item_group?: string;
  brand?: string;
  disabled?: 0 | 1;
}

export interface LoginResponse {
  message: string;
  full_name?: string;
}

export interface CurrentUser {
  email: string;
  fullName?: string;
}

/** GET /api/items — Express ke through items fetch karo */
export async function fetchItems(params?: { limit?: number; search?: string }): Promise<ErpnextItem[]> {
  const { data } = await api.get<{ data: ErpnextItem[] }>("/api/items", {
    params: {
      limit: params?.limit ?? 50,
      search: params?.search,
    },
  });
  return data.data;
}

/** GET /api/items/:name — Express ke through single item */
export async function fetchItem(name: string): Promise<ErpnextItem> {
  const { data } = await api.get<{ data: ErpnextItem }>(`/api/items/${encodeURIComponent(name)}`);
  return data.data;
}

/** POST /api/auth/login — Express ke through ERPNext login */
export async function login(usr: string, pwd: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", { usr, pwd });
  return data;
}

/** POST /api/auth/logout — Express ke through logout */
export async function logout(): Promise<void> {
  await api.post("/api/auth/logout", {});
}

/** GET /api/auth/me — logged in user check */
export async function getLoggedUser(): Promise<CurrentUser | null> {
  try {
    const { data } = await api.get<{ user: CurrentUser | null }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Frappe self-signup — Express ke through
 */
export async function signUp(email: string, fullName: string): Promise<{ message: number | string }> {
  const { data } = await api.post<{ message: number | string }>(
    "/api/auth/signup",
    { email, full_name: fullName },
  );
  return data;
}

/**
 * ERPNext file URL resolve karo — image ke liye
 */
export function resolveImageUrl(image?: string | null): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  const base = (import.meta.env.VITE_ERPNEXT_URL ?? "").replace(/\/$/, "");
  if (!base) return image;
  return `${base}${image.startsWith("/") ? "" : "/"}${image}`;
}
