"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, PlusCircle, Wrench, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Garagem", href: "/garagem", icon: Car },
  { label: "Registrar", href: "/registrar", icon: PlusCircle, cta: true },
  { label: "Manutenção", href: "/manutencoes", icon: Wrench },
  { label: "Menu", href: "/passaporte", icon: Menu },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-surface-border bg-gray-950/90 py-2 backdrop-blur-xl lg:hidden">
      {ITEMS.map(({ label, href, icon: Icon, cta }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-2 text-[10px] transition-all duration-200",
              cta ? "text-white" : active ? "text-brand-400" : "text-gray-400"
            )}
          >
            {cta ? (
              <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-500/30 active:scale-[0.98]">
                <Icon className="h-6 w-6" />
              </span>
            ) : (
              <Icon className="h-5 w-5" />
            )}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
