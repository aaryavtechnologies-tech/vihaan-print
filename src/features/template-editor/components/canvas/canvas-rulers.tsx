"use client";

import { useEditorStore } from "../../store/editor-store";

interface CanvasRulersProps {
  width: number;
  height: number;
}

export function CanvasRulers({ width, height }: CanvasRulersProps) {
  const { rulerEnabled } = useEditorStore();

  if (!rulerEnabled) return null;

  return (
    <>
      {/* Top Ruler Placeholder */}
      <div 
        className="absolute top-0 left-5 right-0 h-5 bg-white dark:bg-slate-900 border-b z-10 opacity-70"
        style={{ width: width - 20 }}
      >
        <div className="text-[9px] text-slate-400 pl-2 pt-0.5">Top Ruler Placeholder</div>
      </div>
      
      {/* Left Ruler Placeholder */}
      <div 
        className="absolute top-5 left-0 bottom-0 w-5 bg-white dark:bg-slate-900 border-r z-10 opacity-70"
        style={{ height: height - 20 }}
      >
        <div className="text-[9px] text-slate-400 -rotate-90 transform origin-top-left translate-y-[100px] whitespace-nowrap">Left Ruler Placeholder</div>
      </div>
      
      {/* Corner Square */}
      <div className="absolute top-0 left-0 w-5 h-5 bg-white dark:bg-slate-900 border-b border-r z-20" />
    </>
  );
}
