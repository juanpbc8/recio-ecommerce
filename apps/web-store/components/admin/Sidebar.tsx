import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  PackageCheck,
  Users2
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Panel de Control",
    href: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Productos",
    href: "/admin/productos",
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "Categorías",
    href: "/admin/categorias",
    icon: <Tags size={20} />,
  },
  {
    label: "Órdenes",
    href: "/admin/ordenes",
    icon: <PackageCheck size={20} />,
  },
  {
    label: "Administradores",
    href: "/admin/usuarios",
    icon: <Users2 size={20} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="bg-secondary border-r border-border flex flex-col min-h-screen w-64 px-0 py-0 font-sans"
      aria-label="Sidebar de administración"
    >
      <div className="flex flex-col gap-0 px-8 py-8 border-b border-border">
        <span className="text-2xl text-foreground tracking-tight font-display font-bold select-none uppercase">
          RECIO ADMIN
        </span>
        <span className="block h-[1.5px] bg-border opacity-75 mt-3" />
      </div>
      <nav className="flex flex-col gap-1 py-8 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-4 px-6 py-3 uppercase font-medium text-base font-sans transition-colors duration-200
                border-l-4
                ${isActive
                  ? "bg-background border-border-strong text-foreground shadow-[inset_0_1px_0_0_#e4e4e7] z-10"
                  : "border-transparent text-neutral-500 hover:bg-background hover:text-foreground/90"}
                rounded-none
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={`flex-none transition-colors duration-200 ${isActive ? "text-foreground" : "text-neutral-400 group-hover:text-foreground/80"}`}>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
