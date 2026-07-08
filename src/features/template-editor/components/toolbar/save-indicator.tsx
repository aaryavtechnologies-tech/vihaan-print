"use client";

import { useEditorStore } from "../../store/editor-store";
import { Cloud, CloudOff, Loader2, AlertCircle } from "lucide-react";

export function SaveIndicator() {
  const { dirtyState } = useEditorStore();

  if (dirtyState === "CLEAN") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 absolute top-4">
        <Cloud className="w-3 h-3" />
        <span>Ready</span>
      </div>
    );
  }

  if (dirtyState === "UNSAVED") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-amber-500 absolute top-4">
        <CloudOff className="w-3 h-3" />
        <span>Unsaved changes</span>
      </div>
    );
  }

  if (dirtyState === "SAVING") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-blue-500 absolute top-4">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (dirtyState === "SAVED") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 absolute top-4">
        <Cloud className="w-3 h-3" />
        <span>All changes saved to cloud</span>
      </div>
    );
  }

  if (dirtyState === "ERROR") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-red-500 absolute top-4">
        <AlertCircle className="w-3 h-3" />
        <span>Failed to save</span>
      </div>
    );
  }

  return null;
}
