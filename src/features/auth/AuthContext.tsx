/* eslint-disable react-refresh/only-export-components -- Provider + hook comparten store de sesión. */
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { UserRole } from "../../shared/types/domain";
import { AUTH_EMAIL_COORDINATOR, AUTH_GIF_DOMAIN, AUTH_PASSWORD, AUTH_SESSION_STORAGE_KEY } from "./constants";

export interface AuthUser {
  email: string;
  role: UserRole;
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "email" in parsed &&
      "role" in parsed &&
      (parsed.role === "GIF" || parsed.role === "COORDINATOR")
    ) {
      return { email: String((parsed as AuthUser).email), role: (parsed as AuthUser).role };
    }
  } catch {
    return null;
  }
  return null;
}

function writeStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

let clientUser: AuthUser | null = readStoredUser();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return clientUser;
}

function getServerSnapshot() {
  return null;
}

function setClientUser(next: AuthUser | null) {
  clientUser = next;
  writeStoredUser(next);
  listeners.forEach((listener) => listener());
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((email: string, password: string): { ok: true } | { ok: false; message: string } => {
    const normalized = email.trim().toLowerCase();
    const pass = password.trim();

    if (pass !== AUTH_PASSWORD) {
      return { ok: false, message: "Correo o contrasena incorrectos." };
    }

    if (normalized === AUTH_EMAIL_COORDINATOR.toLowerCase()) {
      setClientUser({ email: AUTH_EMAIL_COORDINATOR, role: "COORDINATOR" });
      return { ok: true };
    }

    if (normalized.endsWith(AUTH_GIF_DOMAIN)) {
      setClientUser({ email: normalized, role: "GIF" });
      return { ok: true };
    }

    return {
      ok: false,
      message: `Use ${AUTH_EMAIL_COORDINATOR} o un correo *${AUTH_GIF_DOMAIN} con la contrasena indicada.`,
    };
  }, []);

  const logout = useCallback(() => {
    setClientUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
