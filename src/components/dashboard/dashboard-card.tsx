import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, description, children, footer, className }: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl bg-white", className)}>
      <CardHeader className="border-b border-slate-100/50 bg-slate-50/30 px-6 py-5">
        <CardTitle className="text-base font-semibold text-slate-800">{title}</CardTitle>
        {description && (
          <CardDescription className="text-slate-500 font-medium mt-1">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
