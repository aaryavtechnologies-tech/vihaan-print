"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VIHAAN ID PRINT</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
          <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/submit-form">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Submit Form</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
