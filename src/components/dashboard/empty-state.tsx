import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none rounded-2xl", className)}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 mb-6">
          <Icon className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-500 font-medium max-w-sm mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
