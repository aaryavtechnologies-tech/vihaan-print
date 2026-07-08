"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "99.9% Reliable Cloud Infrastructure",
  "Lightning Fast PDF Generation",
  "Secure End-to-End Encryption",
  "Easy Printer Integration",
  "Unlimited Student Records",
  "Multi-School Tenant Support",
  "Automatic Cloud Backup",
  "Professional Pre-built Templates",
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-blue-600 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for scale, designed for simplicity.</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              VIHAAN ID PRINT removes the friction from traditional ID card creation. Stop wrestling with complicated software and start generating professional IDs effortlessly.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-300 shrink-0" />
                  <span className="font-medium text-sm md:text-base">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-blue-950 border-4 border-blue-400/30 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-900 opacity-80" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                     <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                  <span className="text-white font-medium tracking-wide">Watch Platform Tour</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
