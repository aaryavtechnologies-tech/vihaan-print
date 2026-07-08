import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  "#000000", "#111827", "#374151", "#6B7280", "#9CA3AF", "#FFFFFF",
  "#EF4444", "#F97316", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger render={<div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 -ml-1 rounded" />}>
        <div 
          className="w-5 h-5 rounded border border-slate-200 dark:border-slate-700 shadow-sm" 
          style={{ backgroundColor: color || "transparent" }}
        />
        {label && <span className="text-xs text-slate-600">{label}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">HEX Color</label>
            <div className="flex items-center gap-2">
              <Input 
                value={color || ""} 
                onChange={(e) => onChange(e.target.value)} 
                className="h-8 text-xs font-mono"
                placeholder="#000000"
              />
              <div 
                className="w-8 h-8 rounded border shrink-0" 
                style={{ backgroundColor: color || "transparent" }}
              />
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2 border-t">
            <label className="text-xs font-medium text-slate-500">Preset Colors</label>
            <div className="grid grid-cols-7 gap-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onChange(c)}
                  className="w-5 h-5 rounded shadow-sm border border-slate-200/50 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
