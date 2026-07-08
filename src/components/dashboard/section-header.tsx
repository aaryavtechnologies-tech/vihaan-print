import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6 mt-10 first:mt-0">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
        {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
