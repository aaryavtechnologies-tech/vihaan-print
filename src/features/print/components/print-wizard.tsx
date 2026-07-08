"use client";

import { usePrintStore } from "../store/print-store";
import { Step1School } from "./steps/step-1-school";
import { Step2Template } from "./steps/step-2-template";
import { Step3Students } from "./steps/step-3-students";
import { Step4Layout } from "./steps/step-4-layout";
import { Step5Settings } from "./steps/step-5-settings";
import { Step6Preview } from "./steps/step-6-preview";
import { Step7Print } from "./steps/step-7-print";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const steps = [
  { id: 1, title: "School" },
  { id: 2, title: "Template" },
  { id: 3, title: "Students" },
  { id: 4, title: "Layout" },
  { id: 5, title: "Settings" },
  { id: 6, title: "Preview" },
  { id: 7, title: "Print" },
];

export function PrintWizard() {
  const currentStep = usePrintStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1School />;
      case 2: return <Step2Template />;
      case 3: return <Step3Students />;
      case 4: return <Step4Layout />;
      case 5: return <Step5Settings />;
      case 6: return <Step6Preview />;
      case 7: return <Step7Print />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Wizard Header / Stepper */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-between min-w-[600px] w-full relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0 rounded-full" />
          
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted 
                      ? "bg-blue-600 text-white" 
                      : isCurrent 
                        ? "bg-blue-600 text-white ring-4 ring-blue-100" 
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className={`text-xs font-semibold ${isCurrent || isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="p-8 rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[500px]">
        {renderStep()}
      </Card>
    </div>
  );
}
