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
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
