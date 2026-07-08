"use client";

import { useEffect, useState } from "react";
import { useGenerationStore } from "../../store/generation-store";
import { getFilteredStudents } from "../../actions/fetch-students-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Step3Students() {
  const { filters, selectedStudentIds, setSelectedStudents, nextStep, prevStep } = useGenerationStore();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [localSelection, setLocalSelection] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoading(true);
    getFilteredStudents(filters).then(res => {
      if (res.success && res.data) {
        setStudents(res.data);
        // Pre-select if we already had selections
        if (selectedStudentIds === 'ALL') {
          setLocalSelection(new Set(res.data.map(s => s.id)));
        } else {
          setLocalSelection(new Set(selectedStudentIds));
        }
      }
      setIsLoading(false);
    });
  }, [filters]);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    (s.admissionNo && s.admissionNo.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setLocalSelection(new Set(filteredStudents.map(s => s.id)));
    } else {
      setLocalSelection(new Set());
    }
  };

  const handleToggleOne = (id: string, checked: boolean) => {
    const newSet = new Set(localSelection);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setLocalSelection(newSet);
  };

  const handleNext = () => {
    const selectedData = students.filter(s => localSelection.has(s.id));
    setSelectedStudents(Array.from(localSelection), selectedData);
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Select Students</h2>
        <p className="text-slate-500">Choose the students you want to generate ID cards for.</p>
      </div>

      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search name or ID..." 
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          {localSelection.size} Selected
        </div>
      </div>

      <div className="border border-slate-200/60 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 w-12">
                  <Checkbox 
                    checked={localSelection.size === filteredStudents.length && filteredStudents.length > 0}
                    onCheckedChange={handleToggleAll}
                  />
                </th>
                <th className="px-6 py-4 font-semibold text-slate-600">Student</th>
                <th className="px-6 py-4 font-semibold text-slate-600">ID / Adm No</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Class & Sec</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Photo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <Checkbox 
                      checked={localSelection.has(student.id)}
                      onCheckedChange={(c) => handleToggleOne(student.id, c as boolean)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{student.fullName}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {student.studentId} {student.admissionNo && <span className="text-slate-400">/ {student.admissionNo}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {student.className || "-"} {student.section ? `(${student.section})` : ""}
                  </td>
                  <td className="px-6 py-4">
                    {student.photo ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700">
                        Missing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          disabled={localSelection.size === 0} 
          onClick={handleNext}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Preview Cards
        </Button>
      </div>
    </div>
  );
}
