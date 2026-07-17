"use client";

import { useDashboardStore } from "@/store/dashboard-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LayoutDashboard, Building2, LayoutTemplate, Users, IdCard, Printer, BarChart3, Settings, PanelLeftClose, PanelLeftOpen, Database, History, CreditCard } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const primaryLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/dashboard/students", icon: Users },
  { label: "Schools", href: "/dashboard/schools", icon: Building2 },
  { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
];

export const actionLinks = [
  { label: "Bulk Import", href: "/dashboard/import", icon: Database },
  { label: "Import History", href: "/dashboard/import/history", icon: History },
  { label: "Generate ID", href: "/dashboard/generate", icon: IdCard },
  { label: "Generation History", href: "/dashboard/generate/history", icon: History },
  { label: "Generated Cards", href: "/dashboard/generated-cards", icon: CreditCard },
  { label: "Print Center", href: "/dashboard/print", icon: Printer },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useDashboardStore();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isSidebarCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex flex-col bg-white border-r border-slate-200 shadow-sm shrink-0 h-screen sticky top-0 z-40"
    >
      <div className="flex h-16 items-center px-4 border-b border-slate-100 shrink-0">
        <div className={cn("flex items-center gap-2 font-semibold", isSidebarCollapsed ? "justify-center w-full" : "")}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          {!isSidebarCollapsed && <span className="text-lg tracking-tight truncate text-slate-900">VIHAAN ID PRINT</span>}
        </div>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-3">
          {primaryLinks.map((link) => (
            <SidebarItem key={link.href} {...link} isCollapsed={isSidebarCollapsed} />
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t flex flex-col gap-2 shrink-0">
        <SidebarItem label="Settings" href="/dashboard/settings" icon={Settings} isCollapsed={isSidebarCollapsed} />
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("w-full h-10", isSidebarCollapsed ? "" : "justify-start px-3")}
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : (
             <>
               <PanelLeftClose className="h-5 w-5 mr-3" />
               <span>Collapse Sidebar</span>
             </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
