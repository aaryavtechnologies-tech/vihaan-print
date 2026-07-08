"use client";

import { usePrintStore } from "../../store/print-store";
import { Button } from "@/components/ui/button";
import { CreditCard, Grid2x2, Grid3x3 } from "lucide-react";

export function Step4Layout() {
  const { layoutSettings, setLayoutSettings, nextStep, prevStep } = usePrintStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Choose Layout</h2>
        <p className="text-slate-500">Select how you want to print the generated ID cards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setLayoutSettings({ layout: 'SINGLE_PVC' })}
          className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 text-center space-y-4 ${
            layoutSettings.layout === 'SINGLE_PVC' 
              ? "border-blue-600 bg-blue-50/50 shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-[1.02]" 
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
          }`}
        >
          <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Single PVC Card</h3>
            <p className="text-sm text-slate-500 mt-1">Direct to CR80 PVC printers. One card per page PDF.</p>
          </div>
        </div>

        <div 
          onClick={() => setLayoutSettings({ layout: 'A4_PORTRAIT' })}
          className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 text-center space-y-4 ${
            layoutSettings.layout === 'A4_PORTRAIT' 
              ? "border-blue-600 bg-blue-50/50 shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-[1.02]" 
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
          }`}
        >
          <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Grid2x2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">A4 Portrait Grid</h3>
            <p className="text-sm text-slate-500 mt-1">Print multiple cards on a vertical A4 sheet. Great for inkjet/laser.</p>
          </div>
        </div>

        <div 
          onClick={() => setLayoutSettings({ layout: 'A4_LANDSCAPE' })}
          className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 text-center space-y-4 ${
            layoutSettings.layout === 'A4_LANDSCAPE' 
              ? "border-blue-600 bg-blue-50/50 shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-[1.02]" 
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
          }`}
        >
          <div className="mx-auto w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Grid3x3 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">A4 Landscape Grid</h3>
            <p className="text-sm text-slate-500 mt-1">Print multiple cards on a horizontal A4 sheet.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Configure Settings
        </Button>
      </div>
    </div>
  );
}
