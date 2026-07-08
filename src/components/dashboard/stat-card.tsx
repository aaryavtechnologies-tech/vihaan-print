import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
        <CardTitle className="text-sm font-semibold text-slate-500 tracking-tight">{title}</CardTitle>
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
        {trend && (
          <p className="text-sm font-medium mt-2 flex items-center text-slate-500">
            <span
              className={cn(
                "mr-1.5 flex items-center font-semibold",
                trend.direction === "up" ? "text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md" : trend.direction === "down" ? "text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md" : "text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md"
              )}
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "−"} {trend.value}%
            </span>
            {trend.label}
          </p>
        )}
        {!trend && description && (
          <p className="text-sm text-slate-500 mt-2 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
