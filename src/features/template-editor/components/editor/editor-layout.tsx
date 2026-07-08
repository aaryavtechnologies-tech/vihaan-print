"use client";

import { useEditorStore } from "../../store/editor-store";
import { TopToolbar } from "../toolbar/top-toolbar";
import { LeftSidebar } from "../sidebar/left-sidebar";
import { RightPanel } from "../properties/right-panel";
import { StatusBar } from "../statusbar/status-bar";
import { CanvasWorkspace } from "../canvas/canvas-workspace";
import { useEditorShortcuts } from "../../hooks/useEditorShortcuts";
import { useAutoSave } from "../../hooks/useAutoSave";
import { BatchRenderer } from "../render/BatchRenderer";

export function EditorLayout() {
  const rightPanelOpen = useEditorStore((state) => state.rightPanelOpen);
  
  // Register global shortcuts
  useEditorShortcuts();
  
  // Enable auto-saving
  useAutoSave();

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      <TopToolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar />
        
        <main className="flex-1 relative bg-[#e5e5e5] dark:bg-zinc-900 overflow-hidden flex flex-col">
          <CanvasWorkspace />
        </main>

        {rightPanelOpen && <RightPanel />}
      </div>

      <StatusBar />
      
      {/* Hidden batch renderer for generating export files */}
      <BatchRenderer />
    </div>
  );
}
