"use client";

import { useEditorStore } from "../../store/editor-store";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Undo2, Redo2, ZoomIn, ZoomOut, Maximize, 
  MonitorPlay, Save, CheckCircle2, Cloud
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function TopToolbar() {
  const { zoomLevel, zoomIn, zoomOut, setZoomLevel } = useEditorStore();

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
      {/* Left: Branding & Back */}
      <div className="flex items-center gap-3">
        <Link href="/templates">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Center: Template Name & Save Status */}
      <div className="flex flex-col items-center flex-1 justify-center relative">
        <h1 className="text-sm font-semibold tracking-tight absolute -top-1">Student ID - 2026 Batch</h1>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 absolute top-4">
          <Cloud className="w-3 h-3" />
          <span>All changes saved to cloud</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" disabled>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400" disabled>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <select 
            className="text-xs bg-transparent border-none outline-none font-medium w-16 text-center cursor-pointer"
            value={zoomLevel}
            onChange={handleZoomChange}
          >
            <option value={0.5}>50%</option>
            <option value={1}>100%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
            <option value={3}>300%</option>
            <option value={5}>500%</option>
          </select>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Fit to screen">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
        
        <ThemeToggle />

        <Button variant="outline" size="sm" className="h-8 ml-2">
          <MonitorPlay className="h-4 w-4 mr-2" />
          Preview
        </Button>
        
        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </header>
  );
}
