import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8 relative">
      <div className="absolute left-0 top-[15px] w-full h-[2px] bg-slate-200 z-0" />
      <div 
        className="absolute left-0 top-[15px] h-[2px] bg-blue-600 z-0 transition-all duration-300" 
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shadow-sm border-2",
                isActive 
                  ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50" 
                  : isCompleted 
                    ? "bg-blue-600 border-blue-600 text-white" 
                    : "bg-white border-slate-300 text-slate-500"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <div className="mt-3 flex flex-col items-center">
              <span className={cn(
                "text-xs font-semibold whitespace-nowrap transition-colors",
                isActive ? "text-blue-900" : isCompleted ? "text-slate-700" : "text-slate-500"
              )}>
                {step.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
