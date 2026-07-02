"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth, MOCK_EMAIL, MOCK_PASSWORD } from "@/components/admin/AdminAuthProvider";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, login } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya está autenticado, redirigir
    if (isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Error inesperado.");
    }
    // On success, router.replace will occur on isAuthenticated effect
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <form
        className="bg-background border border-border p-10 flex flex-col gap-8 min-w-[340px] w-full max-w-sm mx-auto rounded-none shadow-none font-sans"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-display font-bold tracking-tight text-foreground mb-2">Iniciar Sesión</h1>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 w-full">
            <span className="text-sm text-foreground font-medium">Correo electrónico</span>
            <input
              type="email"
              name="email"
              required
              autoFocus
              className="bg-secondary border border-border text-foreground px-4 py-2 outline-none focus:border-border-strong transition-colors duration-200 font-sans rounded-none"
              placeholder="nombre@recio.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 w-full">
            <span className="text-sm text-foreground font-medium">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              className="bg-secondary border border-border text-foreground px-4 py-2 outline-none focus:border-border-strong transition-colors duration-200 font-sans rounded-none"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 select-none pt-1">
            <input
              type="checkbox"
              className="accent-foreground size-4 border border-border rounded-none"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span className="text-sm text-foreground">Recordarme</span>
          </label>
        </div>
        {error && (
          <div className="text-error bg-error/10 border border-error rounded-none px-3 py-2 text-sm font-sans">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-foreground text-background font-display text-base font-medium py-3 px-6 w-full uppercase tracking-wide outline-none border border-border rounded-none transition-opacity duration-200 hover:opacity-[var(--opacity-hover)] focus:opacity-[var(--opacity-hover)] active:opacity-90 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
        <div className="pt-2 text-xs text-neutral-400 text-center select-text">
          <span>• Acceso de prueba: <b>{MOCK_EMAIL}</b> / <b>{MOCK_PASSWORD}</b></span>
        </div>
      </form>
    </div>
  );
}

