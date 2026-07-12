"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { pageTitle } from "./nav-items";

type Props = { userName: string; userAvatar?: string; notifications?: number };

export function Header({ userName, userAvatar, notifications = 0 }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-surface-border bg-gray-950/80 px-4 py-4 backdrop-blur-xl lg:px-8">
      <h1 className="font-display text-lg font-semibold text-gray-100">
        {pageTitle(pathname)}
      </h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-100" aria-label="Notificações">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
              {notifications}
            </span>
          )}
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
