import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditorElement, PlaceholderElement } from "../../../types/element-types";
import { useEditorStore } from "../../../store/editor-store";
import { Database } from "lucide-react";

const DATA_BINDINGS = [
  { value: "student_name", label: "Student Name" },
  { value: "father_name", label: "Father Name" },
  { value: "mother_name", label: "Mother Name" },
  { value: "class", label: "Class" },
  { value: "section", label: "Section" },
  { value: "roll_number", label: "Roll Number" },
  { value: "admission_number", label: "Admission No." },
  { value: "student_id", label: "Student ID" },
  { value: "dob", label: "Date of Birth" },
  { value: "gender", label: "Gender" },
  { value: "blood_group", label: "Blood Group" },
  { value: "mobile", label: "Mobile Number" },
  { value: "address", label: "Address" },
  { value: "school_name", label: "School Name" },
  { value: "student_photo", label: "Student Photo (Image)" },
  { value: "school_logo", label: "School Logo (Image)" },
  { value: "principal_signature", label: "Signature (Image)" },
];

export function DataBindingSection({ element }: { element: EditorElement }) {
  const { updateElement } = useEditorStore();
  
  if (element.type !== "placeholder") return null;
  const placeEl = element as PlaceholderElement;

  return (
    <AccordionItem value="binding" className="border-b-0">
      <AccordionTrigger className="px-4 py-3 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
        <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5"/> Data Binding</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Map to Database Field</Label>
          <Select 
            value={placeEl.placeholderType} 
            onValueChange={(val) => {
              const selected = DATA_BINDINGS.find(b => b.value === val);
              updateElement(element.id, { 
                placeholderType: val as any,
                placeholderText: selected ? `[${selected.label}]` : placeEl.placeholderText
              });
            }}
          >
            <SelectTrigger className="h-8 text-sm bg-blue-50/50 border-blue-200">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {DATA_BINDINGS.map(b => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-slate-400 mt-1">This placeholder will be replaced with real student data during printing.</p>
        </div>

      </AccordionContent>
    </AccordionItem>
  );
}
