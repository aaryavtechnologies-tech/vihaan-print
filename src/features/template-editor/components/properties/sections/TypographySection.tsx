import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextElement, EditorElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type } from "lucide-react";
import { ColorPicker } from "./ColorPicker";

export function TypographySection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();
  
  if (element.type !== "text") return null;
  const textEl = element as TextElement;

  return (
    <AccordionItem value="typography" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        Typography
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        
        {/* Font Family */}
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Font</Label>
          <Select 
            value={textEl.fontFamily} 
            onValueChange={(val) => updateElement(element.id, { fontFamily: val || "Inter, sans-serif" })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {["Inter, sans-serif", "Arial, sans-serif", "Times New Roman, serif", "Courier New, monospace", "Georgia, serif"].map(f => (
                <SelectItem key={f} value={f}>{f.split(",")[0]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size & Weight */}
        <div className="flex gap-2">
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-slate-500">Size</Label>
            <Input 
              type="number"
              value={textEl.fontSize}
              onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) || 12 })}
              className="h-8 text-sm"
              min={1}
            />
          </div>
          <div className="space-y-1.5 flex-[1.5]">
            <Label className="text-xs text-slate-500">Weight</Label>
            <Select 
              value={String(textEl.fontWeight)} 
              onValueChange={(val) => updateElement(element.id, { fontWeight: val as any })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lighter">Light</SelectItem>
                <SelectItem value="normal">Regular</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="bolder">Extra Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Alignment</Label>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
            {[
              { val: "left", icon: AlignLeft },
              { val: "center", icon: AlignCenter },
              { val: "right", icon: AlignRight },
              { val: "justify", icon: AlignJustify }
            ].map(({ val, icon: Icon }) => (
              <button
                key={val}
                onClick={() => updateElement(element.id, { textAlign: val as any })}
                className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${
                  textEl.textAlign === val 
                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-500 flex items-center gap-1">Text Color</Label>
            <ColorPicker color={textEl.textColor} onChange={(c) => updateElement(element.id, { textColor: c })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-500 flex items-center gap-1">Background</Label>
            <ColorPicker color={textEl.backgroundColor || "transparent"} onChange={(c) => updateElement(element.id, { backgroundColor: c })} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Label className="text-xs text-slate-500 flex items-center gap-1"><Type className="w-3 h-3"/> Content</Label>
          <textarea 
            value={textEl.text}
            onChange={(e) => updateElement(element.id, { text: e.target.value })}
            className="w-full min-h-[80px] p-2 text-sm border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-white dark:bg-slate-950 resize-y"
          />
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}
