import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 mt-8 first:mt-0">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
