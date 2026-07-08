"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  colorClass?: string;
}

export function QuickActionCard({ title, description, icon: Icon, href, className, colorClass = "text-primary bg-primary/10" }: QuickActionCardProps) {
  return (
    <Link href={href} className="block outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl group">
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Card className={cn("h-full cursor-pointer border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl bg-white group-hover:border-blue-200 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300", className)}>
          <CardContent className="flex flex-col items-start p-6">
            <div className={cn("p-3 rounded-xl mb-4 shadow-sm", colorClass)}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 font-medium">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
