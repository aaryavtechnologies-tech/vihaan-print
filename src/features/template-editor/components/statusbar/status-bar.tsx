"use client";

import { useEditorStore } from "../../store/editor-store";
import { MousePointer2, Wifi, Scan } from "lucide-react";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";

export function StatusBar() {
  const { zoomLevel, canvasPosition } = useEditorStore();

  return (
    <footer className="h-8 bg-white dark:bg-slate-900 border-t flex items-center justify-between px-3 text-[11px] font-medium text-slate-500 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="Canvas Dimensions (CR80)">
          <Scan className="h-3 w-3" />
          {EDITOR_CONSTANTS.CARD_WIDTH_MM}mm × {EDITOR_CONSTANTS.CARD_HEIGHT_MM}mm
        </div>
        <div className="flex items-center gap-1.5" title="Zoom Level">
          {Math.round(zoomLevel * 100)}%
        </div>
        <div className="flex items-center gap-1.5" title="Canvas Pan Position">
          <MousePointer2 className="h-3 w-3" />
          X: {Math.round(canvasPosition.x)}, Y: {Math.round(canvasPosition.y)}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div>v1.0.0-draft</div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <Wifi className="h-3 w-3" />
          Connected
        </div>
      </div>
    </footer>
  );
}
