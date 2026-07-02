"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/AdminAuthProvider";

function AdminLayoutProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();

  // Redirigir si no autenticado → /admin/login, salvo en login
  useEffect(() => {
    if (pathname !== "/admin/login" && !isAuthenticated) {
      router.replace("/admin/login");
    }
    if (pathname === "/admin/login" && isAuthenticated) {
      router.replace("/admin");
    }
  }, [pathname, isAuthenticated, router]);

  const shouldShowSidebar = pathname !== "/admin/login" && isAuthenticated;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {shouldShowSidebar && (
        <div className="hidden md:flex flex-col h-screen sticky top-0 z-30 select-none">
          <Sidebar />
        </div>
      )}
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutProtectedShell>{children}</AdminLayoutProtectedShell>
    </AdminAuthProvider>
  );
}

