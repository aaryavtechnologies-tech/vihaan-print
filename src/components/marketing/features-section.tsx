"use client";

import { motion } from "framer-motion";
import { Users, Building2, MousePointerSquareDashed, ImageMinus, Upload, Printer, Cloud, Search, BarChart3, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { title: "Student Management", description: "Easily manage thousands of student records with our intuitive table interface.", icon: Users, color: "bg-blue-500/10 text-blue-500" },
  { title: "Multi-School Support", description: "Manage multiple branches or tenant schools from a single master dashboard.", icon: Building2, color: "bg-indigo-500/10 text-indigo-500" },
  { title: "Drag & Drop Editor", description: "Design custom ID templates visually without writing a single line of code.", icon: MousePointerSquareDashed, color: "bg-purple-500/10 text-purple-500" },
  { title: "AI Background Removal", description: "Automatically remove backgrounds from student photos for a clean look.", icon: ImageMinus, color: "bg-rose-500/10 text-rose-500" },
  { title: "Bulk Excel Import", description: "Upload Excel or CSV files to generate hundreds of IDs instantly.", icon: Upload, color: "bg-emerald-500/10 text-emerald-500" },
  { title: "Instant PDF Generation", description: "Export print-ready PDF files formatted exactly to your printer specifications.", icon: Printer, color: "bg-orange-500/10 text-orange-500" },
  { title: "Cloud Storage", description: "Securely store templates, photos, and generated IDs in the cloud.", icon: Cloud, color: "bg-cyan-500/10 text-cyan-500" },
  { title: "Search & Filters", description: "Quickly find specific students or batches using advanced filtering.", icon: Search, color: "bg-amber-500/10 text-amber-500" },
  { title: "Analytics Dashboard", description: "Track generation metrics, active schools, and system usage over time.", icon: BarChart3, color: "bg-pink-500/10 text-pink-500" },
  { title: "Enterprise Security", description: "Role-based access control and encrypted data storage keep student data safe.", icon: Fingerprint, color: "bg-slate-500/10 text-slate-500" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">manage ID cards</span></h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools built specifically for educational institutions to streamline the ID card generation process from start to finish.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/30"
              >
                <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl", feature.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
