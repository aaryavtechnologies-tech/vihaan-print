import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorElement, ShapeElement, PlaceholderElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";
import { ColorPicker } from "./ColorPicker";
import { Square } from "lucide-react";

export function AppearanceSection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();
  
  // Can apply to shapes, placeholders, even text background eventually
  const shapeEl = element as ShapeElement; 
  const placeEl = element as PlaceholderElement;
  
  const fill = shapeEl.fill !== undefined ? shapeEl.fill : (placeEl.fill !== undefined ? placeEl.fill : undefined);
  const stroke = shapeEl.stroke !== undefined ? shapeEl.stroke : undefined;
  
  return (
    <AccordionItem value="appearance" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        Appearance
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-500 flex items-center gap-1">Fill Color</Label>
            <ColorPicker color={fill || "transparent"} onChange={(c) => updateElement(element.id, { fill: c })} />
          </div>
          
          {element.type !== "placeholder" && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-slate-500 flex items-center gap-1">Border Color</Label>
              <ColorPicker color={stroke || "transparent"} onChange={(c) => updateElement(element.id, { stroke: c })} />
            </div>
          )}
        </div>

        {element.type !== "placeholder" && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-slate-500">Border Width</Label>
              <div className="relative w-24">
                <Input 
                  type="number"
                  value={shapeEl.strokeWidth || 0}
                  onChange={(e) => updateElement(element.id, { strokeWidth: parseInt(e.target.value) || 0 })}
                  className="h-8 text-sm pr-6"
                  min={0}
                />
                <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
              </div>
            </div>

            {element.type === "rectangle" && (
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500 flex items-center gap-1"><Square className="w-3 h-3"/> Radius</Label>
                <div className="relative w-24">
                  <Input 
                    type="number"
                    value={shapeEl.cornerRadius || 0}
                    onChange={(e) => updateElement(element.id, { cornerRadius: parseInt(e.target.value) || 0 })}
                    className="h-8 text-sm pr-6"
                    min={0}
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-slate-400 pointer-events-none">px</span>
                </div>
              </div>
            )}
          </div>
        )}

      </AccordionContent>
    </AccordionItem>
  );
}
