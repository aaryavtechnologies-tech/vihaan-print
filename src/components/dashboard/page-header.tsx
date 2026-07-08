import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
