"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Ready to Simplify Student <br className="hidden md:block"/> ID Card Management?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
        >
          Join hundreds of innovative schools using VIHAAN to automate their entire ID generation workflow securely in the cloud.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 text-lg rounded-full">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-slate-700 text-white hover:bg-slate-800 hover:text-white bg-transparent">
              Contact Sales
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
