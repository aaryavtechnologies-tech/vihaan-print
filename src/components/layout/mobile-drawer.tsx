"use client";

import { useDashboardStore } from "@/store/dashboard-store";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { primaryLinks, actionLinks } from "./sidebar";
import { SidebarItem } from "./sidebar-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";

export function MobileDrawer() {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useDashboardStore();

  return (
    <Sheet open={isMobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Access dashboard navigation links.</SheetDescription>
        <div className="flex h-16 items-center px-6 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-lg tracking-tight">VIHAAN ID PRINT</span>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
          <div className="flex flex-col gap-1 p-4">
            {primaryLinks.map((link) => (
              <div key={link.href} onClick={() => setMobileDrawerOpen(false)}>
                <SidebarItem {...link} isCollapsed={false} />
              </div>
            ))}
            
            <div className="my-4">
               <Separator />
            </div>
            
            <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </h4>
            
            {actionLinks.map((link) => (
              <div key={link.href} onClick={() => setMobileDrawerOpen(false)}>
                <SidebarItem {...link} isCollapsed={false} />
              </div>
            ))}

            <div className="my-4">
               <Separator />
            </div>
            
            <div onClick={() => setMobileDrawerOpen(false)}>
               <SidebarItem label="Settings" href="/dashboard/settings" icon={Settings} isCollapsed={false} />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
