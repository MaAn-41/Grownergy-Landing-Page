import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getLoggedUser, login as erpLogin, logout as erpLogout, type CurrentUser } from "@/lib/erpnext";

/**
 * Auth context backed by ERPNext session cookies.
 * - On mount, ask ERPNext who the current user is.
 * - login()/logout() proxy to the ERPNext REST endpoints.
 */
interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const u = await getLoggedUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async (email: string, password: string) => {
    await erpLogin(email, password);
    await refresh();
  };

  const logout = async () => {
    try {
      await erpLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
