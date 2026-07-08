"use client";

import { useEffect, useState } from "react";
import { useImportStore } from "../../store/import-store";
import { getSetupData } from "../../actions/setup-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, LayoutTemplate, GraduationCap, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step1Setup() {
  const { setupContext, setSetupContext, nextStep } = useImportStore();
  const [schools, setSchools] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  const [schoolId, setSchoolId] = useState(setupContext?.schoolId || "");
  const [templateId, setTemplateId] = useState(setupContext?.templateId || "");
  const [academicYear, setAcademicYear] = useState(setupContext?.academicYear || "2024-2025");
  const [className, setClassName] = useState(setupContext?.className || "");
  const [section, setSection] = useState(setupContext?.section || "");

  useEffect(() => {
    getSetupData().then(data => {
      setSchools(data.schools);
      setTemplates(data.templates);
    });
  }, []);

  const handleNext = () => {
    setSetupContext({ schoolId, templateId, academicYear, className, section });
    nextStep();
  };

  const filteredTemplates = templates.filter(t => !t.schoolId || t.schoolId === schoolId);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Import Context</h2>
        <p className="text-slate-500">Select the school and target configuration for this import.</p>
      </div>

      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4" /> Select School *
          </label>
          <Select value={schoolId} onValueChange={setSchoolId}>
            <SelectTrigger className="h-12 bg-white rounded-xl shadow-sm">
              <SelectValue placeholder="Choose a school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.schoolName} ({s.schoolCode})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <LayoutTemplate className="w-4 h-4" /> Default Template (Optional)
          </label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger className="h-12 bg-white rounded-xl shadow-sm">
              <SelectValue placeholder="No default template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {filteredTemplates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <GraduationCap className="w-4 h-4" /> Class / Grade
            </label>
            <Input 
              placeholder="e.g. 10, XII" 
              className="h-12 bg-white rounded-xl shadow-sm"
              value={className}
              onChange={e => setClassName(e.target.value)}
            />
            <p className="text-xs text-slate-500">Applied if missing in file</p>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4" /> Section
            </label>
            <Input 
              placeholder="e.g. A, Science" 
              className="h-12 bg-white rounded-xl shadow-sm"
              value={section}
              onChange={e => setSection(e.target.value)}
            />
            <p className="text-xs text-slate-500">Applied if missing in file</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={!schoolId} 
          onClick={handleNext}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Continue to Upload
        </Button>
      </div>
    </div>
  );
}
