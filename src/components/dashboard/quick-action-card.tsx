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
    <Link href={href} className="block outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl">
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Card className={cn("h-full cursor-pointer hover:border-primary/50 transition-colors", className)}>
          <CardContent className="flex flex-col items-start p-6">
            <div className={cn("p-3 rounded-lg mb-4", colorClass)}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
