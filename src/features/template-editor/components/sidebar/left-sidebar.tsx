"use client";

import { useEditorStore, SidebarTab } from "../../store/editor-store";
import { 
  LayoutTemplate, Shapes, Image as ImageIcon, Type, 
  UploadCloud, ScanLine, QrCode, Layers, History,
  Lock, Unlock, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";
import { HistoryPanel } from "./history-panel";

const SIDEBAR_TABS = [
  { id: "templates", icon: LayoutTemplate, label: "Templates" },
  { id: "elements", icon: Shapes, label: "Elements" },
  { id: "uploads", icon: UploadCloud, label: "Uploads" },
  { id: "text", icon: Type, label: "Text" },
  { id: "images", icon: ImageIcon, label: "Images" },
  { id: "qr", icon: QrCode, label: "QR Code" },
  { id: "barcode", icon: ScanLine, label: "Barcode" },
  { id: "layers", icon: Layers, label: "Layers" },
  { id: "history", icon: History, label: "History" },
] as const;

export function LeftSidebar() {
  const { 
    activeSidebarTab, 
    setActiveSidebarTab,
    elements,
    addElement,
    selectedObjectIds,
    setSelectedObjectIds,
    updateElement
  } = useEditorStore();

  return (
    <div className="flex h-full shrink-0 z-10 shadow-sm border-r bg-white dark:bg-slate-900">
      {/* Icon Navigation */}
      <div className="w-16 flex flex-col items-center py-4 gap-2 overflow-y-auto no-scrollbar">
        {SIDEBAR_TABS.map((tab) => {
          const isActive = activeSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSidebarTab(isActive ? null : (tab.id as SidebarTab))}
              className={cn(
                "w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-colors group relative",
                isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              
              {/* Hover tooltip for small screens if needed, though icon+text is clear enough */}
            </button>
          );
        })}
      </div>

      {/* Expanded Panel */}
      <AnimatePresence initial={false}>
        {activeSidebarTab && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col p-4">
              <h2 className="font-semibold text-lg capitalize mb-4">
                {activeSidebarTab}
              </h2>
              <div className="flex-1 overflow-y-auto mt-2 pr-2">
                {/* TOOL PANELS */}
                {activeSidebarTab === "text" && (
                  <div className="space-y-3">
                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "text", name: "Heading", text: "Add a heading",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 100, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 20,
                      width: 200, height: 40, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(),
                      fontFamily: "Inter, sans-serif", fontSize: 24, fontWeight: "bold", fontStyle: "normal",
                      textColor: "#0f172a", letterSpacing: 0, lineHeight: 1.2, textAlign: "center", textTransform: "none", autoResize: true
                    })} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-lg font-bold">Add a heading</button>
                    
                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "text", name: "Subheading", text: "Add a subheading",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 100, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 10,
                      width: 200, height: 30, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(),
                      fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: "normal", fontStyle: "normal",
                      textColor: "#334155", letterSpacing: 0, lineHeight: 1.2, textAlign: "center", textTransform: "none", autoResize: true
                    })} className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-base font-semibold">Add a subheading</button>

                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "placeholder", name: "Student Name", placeholderType: "student_name", placeholderText: "[Student Name]",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 100, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 15,
                      width: 200, height: 30, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(),
                      fontFamily: "Inter, sans-serif", fontSize: 18, textColor: "#000000", textAlign: "center", fill: "transparent"
                    })} className="w-full text-left p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium flex items-center"><Type className="w-4 h-4 mr-2"/> Student Name Placeholder</button>
                  </div>
                )}

                {activeSidebarTab === "elements" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "rectangle", name: "Rectangle",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 50, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 50,
                      width: 100, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(), fill: "#cbd5e1"
                    })} className="aspect-square flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-medium"><div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-sm"></div> Rectangle</button>

                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "circle", name: "Circle",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 50, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 50,
                      width: 100, height: 100, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(), fill: "#cbd5e1"
                    })} className="aspect-square flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-medium"><div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div> Circle</button>

                    <button onClick={() => addElement({
                      id: crypto.randomUUID(), type: "placeholder", name: "Student Photo", placeholderType: "student_photo", placeholderText: "Photo",
                      x: EDITOR_CONSTANTS.CARD_WIDTH_PX / 2 - 50, y: EDITOR_CONSTANTS.CARD_HEIGHT_PX / 2 - 60,
                      width: 100, height: 120, rotation: 0, opacity: 1, visible: true, locked: false, layerIndex: 0,
                      createdAt: Date.now(), updatedAt: Date.now(), fill: "#e2e8f0"
                    })} className="aspect-square flex flex-col items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-xs font-medium"><ImageIcon className="w-6 h-6"/> Photo Box</button>
                  </div>
                )}
                
                {activeSidebarTab === "layers" && (
                  <div className="space-y-1">
                    {elements.length === 0 ? (
                      <div className="text-center text-sm text-slate-500 py-8">No layers yet.</div>
                    ) : (
                      // Display elements in reverse order so newest (highest layerIndex equivalent) is at the top
                      [...elements].reverse().map((el) => {
                        const isSelected = selectedObjectIds.includes(el.id);
                        return (
                          <div 
                            key={el.id}
                            className={`flex items-center justify-between p-2 rounded-md border text-sm transition-colors ${
                              isSelected
                                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800" 
                                : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                            }`}
                            onClick={() => setSelectedObjectIds([el.id])}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {/* Grab Handle Placeholder */}
                              <div className="w-4 flex justify-center opacity-0 group-hover:opacity-100 cursor-grab">
                                <div className="grid grid-cols-2 gap-0.5">
                                  <div className="w-1 h-1 bg-slate-400 rounded-full" /><div className="w-1 h-1 bg-slate-400 rounded-full" />
                                  <div className="w-1 h-1 bg-slate-400 rounded-full" /><div className="w-1 h-1 bg-slate-400 rounded-full" />
                                  <div className="w-1 h-1 bg-slate-400 rounded-full" /><div className="w-1 h-1 bg-slate-400 rounded-full" />
                                </div>
                              </div>
                              <span className="truncate">{el.name}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                              >
                                {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }); }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                              >
                                {el.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                
                {activeSidebarTab === "history" && (
                  <HistoryPanel />
                )}
                
                {/* Fallback for empty panels */}
                {activeSidebarTab !== "text" && activeSidebarTab !== "elements" && activeSidebarTab !== "layers" && activeSidebarTab !== "history" && (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-sm">
                    {activeSidebarTab} options coming soon
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
