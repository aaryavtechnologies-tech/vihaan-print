"use client";

import { useEditorStore, SidebarTab } from "../../store/editor-store";
import { 
  LayoutTemplate, Shapes, Image as ImageIcon, Type, 
  UploadCloud, ScanLine, QrCode, Layers, History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const { activeSidebarTab, setActiveSidebarTab } = useEditorStore();

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
              <div className="flex-1 overflow-y-auto">
                {/* Placeholder content for panels */}
                <div className="flex items-center justify-center h-48 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-sm">
                  {activeSidebarTab} options coming soon
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
