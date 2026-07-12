import {
  LayoutDashboard,
  Car,
  PlusCircle,
  Wrench,
  Sparkles,
  ShieldCheck,
  BookMarked,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  cta?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Minha Garagem", href: "/garagem", icon: Car },
  { label: "Registrar", href: "/registrar", icon: PlusCircle, cta: true },
  { label: "Manutenções", href: "/manutencoes", icon: Wrench },
  { label: "Estética", href: "/estetica", icon: Sparkles },
  { label: "DETRAN", href: "/detran", icon: ShieldCheck },
  { label: "Meu Passaporte", href: "/passaporte", icon: BookMarked },
];

export function pageTitle(pathname: string): string {
  return (
    NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ?? "AutoCare Passport"
  );
}
