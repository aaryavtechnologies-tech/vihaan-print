"use client";

import { useEffect, useState } from "react";
import { usePrintStore } from "../../store/print-store";
import { getSetupData } from "@/features/import/actions/setup-actions";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

export function Step2Template() {
  const { filters, setFilters, nextStep, prevStep } = usePrintStore();
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    getSetupData().then(data => {
      // Filter templates belonging to the selected school or global ones
      const filtered = data.templates.filter((t: any) => !t.schoolId || t.schoolId === filters.schoolId);
      setTemplates(filtered);
    });
  }, [filters.schoolId]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Select Template</h2>
        <p className="text-slate-500">Filter the generated cards by the specific ID Template.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((t) => (
          <div 
            key={t.id}
            onClick={() => setFilters({ templateId: t.id })}
            className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
              filters.templateId === t.id 
                ? "border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)] scale-[1.02]" 
                : "border-slate-200 hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <div className="aspect-[0.63] bg-slate-100 flex items-center justify-center p-4">
              <LayoutTemplate className="w-12 h-12 text-slate-300" />
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <h3 className="font-semibold text-slate-900 line-clamp-1">{t.name}</h3>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
            No templates found for this school.
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          disabled={!filters.templateId} 
          onClick={nextStep}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Select Students
        </Button>
      </div>
    </div>
  );
}
