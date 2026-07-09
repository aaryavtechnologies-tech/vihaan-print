"use client";

import { motion } from "framer-motion";
import { Building2, Users, IdCard, Printer } from "lucide-react";

const steps = [
  { step: 1, title: "Create School", description: "Register a new school or tenant in the system and configure basic settings.", icon: Building2 },
  { step: 2, title: "Add Students", description: "Import students via Excel or add them manually with their photos.", icon: Users },
  { step: 3, title: "Generate ID Card", description: "Select a custom template and process the ID cards in bulk automatically.", icon: IdCard },
  { step: 4, title: "Download & Print", description: "Export high-resolution PDFs perfectly formatted for standard PVC printers.", icon: Printer },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-900 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">How it works</h2>
          <p className="text-lg text-slate-400">
            A simple, streamlined process to go from raw data to printed ID cards in minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-500 to-blue-100 dark:from-blue-900/20 dark:via-blue-500/50 dark:to-blue-900/20 -translate-y-1/2 hidden md:block" />

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-blue-500 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="mb-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
