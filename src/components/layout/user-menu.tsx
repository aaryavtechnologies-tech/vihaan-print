"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth-client";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      document.cookie = "better-auth.session_token=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = "better-auth.session_data=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = "better-auth.dont_remember=; Max-Age=0; path=/; SameSite=Lax";
      window.location.assign("/login");
    }
  };

  const user = session?.user;
  const initials = user?.name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "AD";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Administrator"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@vihaan.edu"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* @ts-ignore */}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="cursor-pointer flex w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/* @ts-ignore */}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-100 cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
