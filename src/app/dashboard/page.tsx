"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Building2, LayoutTemplate, Users, IdCard, Database, Cloud, Clock, RefreshCcw, Printer, PlusCircle, UserPlus, Upload } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    { title: "Total Schools", value: "24", icon: Building2, trend: { value: 12, label: "from last month", direction: "up" as const } },
    { title: "Active Templates", value: "156", icon: LayoutTemplate, trend: { value: 5, label: "from last month", direction: "up" as const } },
    { title: "Total Students", value: "14,230", icon: Users, trend: { value: 8, label: "from last month", direction: "up" as const } },
    { title: "IDs Generated", value: "12,450", icon: IdCard, trend: { value: 2, label: "from last month", direction: "up" as const } },
  ];

  const quickActions = [
    { title: "Add School", description: "Register a new school tenant", icon: PlusCircle, href: "/dashboard/schools/new", colorClass: "text-blue-600 bg-blue-50" },
    { title: "Create Template", description: "Design a new ID card template", icon: LayoutTemplate, href: "/dashboard/templates", colorClass: "text-purple-600 bg-purple-50" },
    { title: "Add Student", description: "Register a single student record", icon: UserPlus, href: "/dashboard/students/new", colorClass: "text-emerald-600 bg-emerald-50" },
    { title: "Import Data", description: "Bulk import students via Excel", icon: Upload, href: "/dashboard/students/import", colorClass: "text-amber-600 bg-amber-50" },
    { title: "Generate IDs", description: "Process pending ID cards", icon: IdCard, href: "/dashboard/generate", colorClass: "text-indigo-600 bg-indigo-50" },
    { title: "Print Center", description: "Send generated IDs to printer", icon: Printer, href: "/dashboard/print", colorClass: "text-rose-600 bg-rose-50" },
  ];

  const activities = [
    { id: "1", title: "150 IDs Printed", description: "Delhi Public School batch completed", timestamp: "10 minutes ago", icon: Printer, iconColorClass: "text-rose-500" },
    { id: "2", title: "New School Added", description: "St. Xavier's High School registered", timestamp: "2 hours ago", icon: Building2, iconColorClass: "text-blue-500" },
    { id: "3", title: "Template Updated", description: "Standard Staff ID v2 published", timestamp: "5 hours ago", icon: LayoutTemplate, iconColorClass: "text-purple-500" },
    { id: "4", title: "Students Imported", description: "500 records imported for DPS", timestamp: "1 day ago", icon: Upload, iconColorClass: "text-amber-500" },
  ];

  const now = new Date("2026-07-09T12:47:00");
  const timeString = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const dateString = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back! It's ${timeString} on ${dateString}.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <SectionHeader title="Quick Actions" description="Commonly used tasks and shortcuts" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-8">
        <div className="lg:col-span-2 space-y-4">
           <SectionHeader title="System Status" />
           <div className="grid gap-4 sm:grid-cols-2">
             <DashboardCard title="Database" description="Neon PostgreSQL Connection">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full bg-emerald-500" />
                   <span className="font-medium">Operational</span>
                 </div>
                 <Database className="h-5 w-5 text-muted-foreground" />
               </div>
               <div className="mt-4 text-sm text-muted-foreground">Latency: 12ms</div>
             </DashboardCard>
             <DashboardCard title="Cloud Storage" description="Cloudinary Media Assets">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="h-3 w-3 rounded-full bg-emerald-500" />
                   <span className="font-medium">Operational</span>
                 </div>
                 <Cloud className="h-5 w-5 text-muted-foreground" />
               </div>
               <div className="mt-4 text-sm text-muted-foreground">Usage: 1.2 GB / 10 GB</div>
             </DashboardCard>
           </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}
