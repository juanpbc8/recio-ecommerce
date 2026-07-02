"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminAuthContextState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextState | undefined>(undefined);

const MOCK_EMAIL = "admin@recio.com";
const MOCK_PASSWORD = "superadmin";
const STORAGE_KEY = "recio:admin-auth";

function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(getStoredAuth());
  }, []);

  const login = async (email: string, password: string) => {
    if (email.trim().toLowerCase() === MOCK_EMAIL && password === MOCK_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Correo o contraseña incorrectos." };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export { MOCK_EMAIL, MOCK_PASSWORD };
