import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";
import { Maximize, Link, Unlink } from "lucide-react";

export function SizeSection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();

  const handleNumericChange = (key: "width" | "height", val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      updateElement(element.id, { [key]: num });
    }
  };

  return (
    <AccordionItem value="size" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        Size
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        
        <div className="flex items-center gap-3">
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-slate-500 flex items-center gap-1"><Maximize className="w-3 h-3"/> W</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={Math.round(element.width)} 
                onChange={(e) => handleNumericChange("width", e.target.value)}
                className="h-8 text-sm pr-6"
                min={1}
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-end h-[52px]">
            <button 
              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
              title="Maintain Aspect Ratio (Pro feature placeholder)"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-slate-500 flex items-center gap-1"><Maximize className="w-3 h-3 rotate-90"/> H</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={Math.round(element.height)} 
                onChange={(e) => handleNumericChange("height", e.target.value)}
                className="h-8 text-sm pr-6"
                min={1}
              />
              <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
            </div>
          </div>
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}
