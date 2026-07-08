"use client";

import { useDashboardStore } from "@/store/dashboard-store";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { toggleMobileDrawer } = useDashboardStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-md transition-shadow",
        scrolled ? "shadow-sm" : ""
      )}
    >
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMobileDrawer} className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="font-semibold tracking-tight">VIHAAN</div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-2 md:gap-4 md:justify-between">
        <div className="hidden md:flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search schools, templates, students..."
              className="w-full rounded-full bg-muted/50 pl-9 focus-visible:bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
