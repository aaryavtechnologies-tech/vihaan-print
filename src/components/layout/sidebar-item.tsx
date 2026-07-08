"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
}

export function SidebarItem({ icon: Icon, label, href, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const linkContent = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
        isCollapsed ? "justify-center px-0" : ""
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        {/* @ts-ignore */}
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
