"use client";

import { useEffect, useState } from "react";
import { useGenerationStore } from "../../store/generation-store";
import { getSetupData } from "@/features/import/actions/setup-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, Users, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step1Filters() {
  const { filters, setFilters, nextStep } = useGenerationStore();
  const [schools, setSchools] = useState<any[]>([]);

  useEffect(() => {
    getSetupData().then(data => {
      setSchools(data.schools);
    });
  }, []);

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Filter Students</h2>
        <p className="text-slate-500">Select the target group of students for this generation batch.</p>
      </div>

      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <Building2 className="w-4 h-4" /> Select School *
          </label>
          <Select value={filters.schoolId || undefined} onValueChange={(val) => setFilters({ schoolId: val as string})}>
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



      </div>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={!filters.schoolId} 
          onClick={handleNext}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Select Template
        </Button>
      </div>
    </div>
  );
}
