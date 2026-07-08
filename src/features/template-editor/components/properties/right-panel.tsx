"use client";

import { useEditorStore } from "../../store/editor-store";
import { MousePointer2, Settings2, Image as ImageIcon, Type, Shapes, QrCode } from "lucide-react";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";
import { Accordion } from "@/components/ui/accordion";
import { EditorElement } from "../../types/element-types";

// Import individual sections (will be implemented next)
import { GeneralSection } from "./sections/GeneralSection";
import { PositionSection } from "./sections/PositionSection";
import { SizeSection } from "./sections/SizeSection";
import { TypographySection } from "./sections/TypographySection";
import { AppearanceSection } from "./sections/AppearanceSection";
import { DataBindingSection } from "./sections/DataBindingSection";

export function RightPanel() {
  const { selectedObjectIds, elements } = useEditorStore();
  const isMultiSelection = selectedObjectIds.length > 1;
  const selectedElement = selectedObjectIds.length === 1 ? elements.find(e => e.id === selectedObjectIds[0]) : null;

  const getElementIcon = (type: EditorElement["type"]) => {
    switch(type) {
      case "text": return <Type className="h-4 w-4" />;
      case "rectangle":
      case "circle":
      case "line": return <Shapes className="h-4 w-4" />;
      case "image": return <ImageIcon className="h-4 w-4" />;
      case "qr":
      case "barcode": return <QrCode className="h-4 w-4" />;
      case "placeholder": return <Settings2 className="h-4 w-4" />;
      default: return <MousePointer2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-80 h-full shrink-0 border-l bg-white dark:bg-slate-900 z-10 shadow-sm flex flex-col">
      {isMultiSelection ? (
        <>
          <div className="h-12 border-b flex items-center px-4 font-semibold text-sm">
            <MousePointer2 className="h-4 w-4 mr-2 text-slate-500" />
            Multiple Objects
          </div>
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-4">
            <Shapes className="h-12 w-12 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{selectedObjectIds.length} Objects Selected</p>
            <p className="text-xs text-center mt-1">Use the alignment toolbar above the canvas to organize these objects.</p>
          </div>
        </>
      ) : selectedElement ? (
        <>
          <div className="h-12 border-b flex items-center px-4 font-semibold text-sm bg-slate-50 dark:bg-slate-950">
            <span className="text-slate-500 mr-2">{getElementIcon(selectedElement.type)}</span>
            <span className="truncate flex-1">{selectedElement.name}</span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {selectedElement.type}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {/* @ts-ignore - Base UI types might not perfectly match standard Radix */}
            <Accordion type="multiple" defaultValue={["general", "position", "size", "typography", "appearance"]} className="w-full">
              
              <GeneralSection element={selectedElement} />
              
              <PositionSection element={selectedElement} />
              
              {/* Size doesn't apply cleanly to Text out of the box unless autoResize is off, but we'll include it */}
              <SizeSection element={selectedElement} />
              
              {selectedElement.type === "text" && (
                <TypographySection element={selectedElement} />
              )}
              
              {(selectedElement.type === "rectangle" || selectedElement.type === "circle" || selectedElement.type === "line" || selectedElement.type === "text" || selectedElement.type === "placeholder") && (
                <AppearanceSection element={selectedElement} />
              )}

              {selectedElement.type === "placeholder" && (
                <DataBindingSection element={selectedElement} />
              )}
              
            </Accordion>
          </div>
        </>
      ) : (
        <>
          <div className="h-12 border-b flex items-center px-4 font-semibold text-sm">
            <Settings2 className="h-4 w-4 mr-2 text-slate-500" />
            Template Properties
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
          </div>
        </>
      )}
    </div>
  );
}
