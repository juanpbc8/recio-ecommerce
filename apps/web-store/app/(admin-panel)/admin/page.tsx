"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

function StatusCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-background border border-border rounded-none p-6 flex flex-col gap-2 items-start shadow-none transition-colors duration-200 min-w-[180px]">
      <span className="text-xs font-sans text-neutral-400 uppercase tracking-wide">{title}</span>
      <span className="text-3xl font-display text-foreground leading-tight">{value}</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { logout } = useAdminAuth();
  const router = useRouter();
  const onLogout = () => {
    logout();
    router.replace("/admin/login");
  };
  return (
    <section className="py-16 px-8 sm:px-16 flex flex-col gap-12 min-h-screen bg-background">
      <div className="flex w-full items-center justify-between mb-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Bienvenido, Administrador</h1>
        <button
          type="button"
          className="border border-border text-foreground bg-background font-sans px-4 py-2 uppercase text-xs tracking-wide hover:bg-error hover:text-background hover:border-error transition-colors duration-200 rounded-none"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
        <StatusCard title="Ventas Totales" value="$32,400" />
        <StatusCard title="Órdenes Pendientes" value="12" />
        <StatusCard title="Productos Activos" value="156" />
      </div>
    </section>
  );
}
