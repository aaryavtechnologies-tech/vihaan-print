"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardPreview } from "./dashboard-preview";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950 min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glow Effects */}
      <div className="absolute left-[-10%] top-[20%] -z-10 h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-[140px]"></div>
      <div className="absolute right-[-10%] bottom-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]"></div>
      <div className="absolute top-[10%] right-[20%] -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/15 blur-[100px]"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column: Text Content */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" /> Introducing VIHAAN ID PRINT 2.0
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]"
            >
              Generate ID Cards <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                At Lightning Speed
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl"
            >
              The most powerful cloud-based platform for educational institutions to create, manage, and print high-quality student ID cards effortlessly.
            </motion.p>

            <motion.ul 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3 mb-10 text-slate-200"
            >
              {[
                "No software installation required",
                "Drag-and-drop template designer",
                "Instant bulk PDF generation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/submit-form" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 h-14 text-base shadow-lg shadow-blue-500/30">
                  Submit Registration Form
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full px-8 h-14 text-base border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Visual Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:w-1/2 w-full mt-10 lg:mt-0 relative"
          >
            {/* Decorative background for the preview */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/25 to-cyan-500/25 blur-2xl rounded-[2rem] -z-10"></div>
            
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 shadow-2xl overflow-hidden relative ring-1 ring-white/10">
              <DashboardPreview />
            </div>
            
            {/* Floating stats card to add depth */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/10 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                 <p className="text-sm text-slate-400 font-medium">Generation Status</p>
                 <p className="font-bold text-white">1,250 IDs Ready</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
