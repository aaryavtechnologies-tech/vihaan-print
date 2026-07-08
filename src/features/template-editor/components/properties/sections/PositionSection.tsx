import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";
import { Move, RotateCcw } from "lucide-react";

export function PositionSection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();

  const handleNumericChange = (key: "x" | "y" | "rotation", val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      updateElement(element.id, { [key]: num });
    }
  };

  return (
    <AccordionItem value="position" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        Position & Rotation
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 flex items-center gap-1"><Move className="w-3 h-3"/> X</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={Math.round(element.x)} 
                onChange={(e) => handleNumericChange("x", e.target.value)}
                className="h-8 text-sm pr-6"
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500 flex items-center gap-1"><Move className="w-3 h-3"/> Y</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={Math.round(element.y)} 
                onChange={(e) => handleNumericChange("y", e.target.value)}
                className="h-8 text-sm pr-6"
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Label className="text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3"/> Rotation</span>
            <button 
              className="text-[10px] text-blue-500 hover:underline"
              onClick={() => updateElement(element.id, { rotation: 0 })}
            >
              Reset
            </button>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type="number" 
                value={Math.round(element.rotation)} 
                onChange={(e) => handleNumericChange("rotation", e.target.value)}
                className="h-8 text-sm pr-6"
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">°</span>
            </div>
            
            {/* Quick snap buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
              {[0, 90, 180, 270].map(angle => (
                <button 
                  key={angle}
                  onClick={() => updateElement(element.id, { rotation: angle })}
                  className="px-2 text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors border-r last:border-r-0 border-slate-200 dark:border-slate-700"
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}
