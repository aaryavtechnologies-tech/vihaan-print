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
    <Card className={cn("border-dashed shadow-none", className)}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
