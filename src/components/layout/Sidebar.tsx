"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

type Props = { userName: string; userAvatar?: string };

export function Sidebar({ userName, userAvatar }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-surface-border bg-surface backdrop-blur-xl">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <Car className="h-5 w-5" />
        </span>
        <span className="font-display font-semibold text-gray-100">
          AutoCare Passport
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon, cta }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200",
                cta
                  ? "bg-brand-500 text-white hover:bg-brand-400 active:scale-[0.98] font-medium my-2"
                  : active
                    ? "bg-surface-hover text-gray-100"
                    : "text-gray-400 hover:bg-surface-hover hover:text-gray-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-surface-border px-6 py-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm text-gray-100">{userName}</span>
      </div>
    </aside>
  );
}
