import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "@shared/api";
import * as api from "@/lib/api";
import { Navigate, useLocation } from "react-router-dom";

interface AuthContextValue {
  user: User | null;
  register: (name: string, email: string, password: string, branch?: "Faridabad" | "Pune") => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const u = await api.me();
      setUser(u);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      register: async (name: string, email: string, password: string, branch?: "Faridabad" | "Pune") => {
        const res = await api.register(name, email, password, branch);
        setUser(res.user || null);
        return res;
      },
      login: async (email: string, password: string) => {
        const res = await api.login(email, password);
        setUser(res.user || null);
        return res;
      },
      logout: () => {
        api.logout();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: Array<User["role"]> }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}