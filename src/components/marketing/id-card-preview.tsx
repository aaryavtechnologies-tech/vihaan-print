"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function IdCardPreview() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto" style={{ perspective: "1000px" }}>
      <motion.div
        className="w-full aspect-[2.125/3.375] relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 bg-white dark:bg-slate-100 rounded-xl shadow-2xl overflow-hidden border border-slate-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-24 bg-blue-600 flex items-center justify-center flex-col text-white">
            <h2 className="font-bold text-lg tracking-wider">VIHAAN ACADEMY</h2>
            <p className="text-xs opacity-80">Excellence in Education</p>
          </div>
          <div className="px-6 py-4 flex flex-col items-center relative">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200 -mt-16 overflow-hidden flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
            <h3 className="text-xl font-bold mt-3 text-slate-800">Aarav Sharma</h3>
            <p className="text-sm text-blue-600 font-semibold mb-4">Student - Grade 10</p>
            
            <div className="w-full space-y-2 text-xs text-slate-600">
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">DOB:</span>
                <span>15 Aug 2010</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-medium">Blood Group:</span>
                <span className="text-red-500 font-bold">O+</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-medium">ID No:</span>
                <span className="font-mono">VH-2026-0492</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-8 bg-blue-600 flex items-center justify-center">
             <div className="w-32 h-4 bg-white/20 rounded"></div>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 bg-white dark:bg-slate-100 rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-12 bg-slate-800 w-full mt-6"></div>
          <div className="p-6 flex-1 text-xs text-slate-600 space-y-4">
             <div>
                <h4 className="font-bold text-slate-800 mb-1">Emergency Contact</h4>
                <p>+91 98765 43210</p>
                <p>Father: Rajiv Sharma</p>
             </div>
             <div>
                <h4 className="font-bold text-slate-800 mb-1">Residential Address</h4>
                <p>123, Vasant Kunj Sector C, New Delhi, India 110070</p>
             </div>
             <div className="pt-4 text-[10px] text-center italic border-t">
                If found, please return to:<br/>
                Vihaan Academy, New Delhi<br/>
                Phone: 011-23456789
             </div>
          </div>
        </div>
      </motion.div>
      <p className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
        Click to flip card
      </p>
    </div>
  );
}
