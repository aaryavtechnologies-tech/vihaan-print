import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";

// Inline switch component since we didn't explicitly check for shadcn Switch
function CustomSwitch({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
        ${checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <span
        className={`
          pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

export function GeneralSection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();

  return (
    <AccordionItem value="general" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        General
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Name</Label>
          <Input 
            value={element.name} 
            onChange={(e) => updateElement(element.id, { name: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-slate-500 cursor-pointer" onClick={() => updateElement(element.id, { visible: !element.visible })}>Visible</Label>
          <CustomSwitch checked={element.visible} onCheckedChange={(v) => updateElement(element.id, { visible: v })} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-slate-500 cursor-pointer" onClick={() => updateElement(element.id, { locked: !element.locked })}>Locked</Label>
          <CustomSwitch checked={element.locked} onCheckedChange={(v) => updateElement(element.id, { locked: v })} />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-500">Opacity</Label>
            <span className="text-xs font-mono text-slate-400">{Math.round((element.opacity ?? 1) * 100)}%</span>
          </div>
          <Slider 
            value={[(element.opacity ?? 1) * 100]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(vals) => updateElement(element.id, { opacity: vals[0] / 100 })}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
