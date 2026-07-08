"use client";

import { useEditorStore } from "../../store/editor-store";
import { MousePointer2, Settings2, Image as ImageIcon } from "lucide-react";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";

export function RightPanel() {
  const { selectedObjectId } = useEditorStore();

  return (
    <div className="w-72 h-full shrink-0 border-l bg-white dark:bg-slate-900 z-10 shadow-sm flex flex-col">
      <div className="h-12 border-b flex items-center px-4 font-semibold text-sm">
        <Settings2 className="h-4 w-4 mr-2 text-slate-500" />
        Properties
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {selectedObjectId ? (
          <div className="text-sm text-slate-500 text-center py-8">
            Properties for selected object will appear here.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <MousePointer2 className="h-12 w-12 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No Object Selected</p>
              <p className="text-xs text-center mt-1">Select an object on the canvas to edit its properties.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Template Info</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Dimensions</span>
                  <span className="font-medium">{EDITOR_CONSTANTS.CARD_WIDTH_MM} × {EDITOR_CONSTANTS.CARD_HEIGHT_MM} mm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Resolution</span>
                  <span className="font-medium">300 DPI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Pixels</span>
                  <span className="font-medium">{EDITOR_CONSTANTS.CARD_WIDTH_PX} × {EDITOR_CONSTANTS.CARD_HEIGHT_PX} px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Orientation</span>
                  <span className="font-medium">Portrait</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Background</h3>
              <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <ImageIcon className="h-6 w-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-500 font-medium">Upload Background</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
