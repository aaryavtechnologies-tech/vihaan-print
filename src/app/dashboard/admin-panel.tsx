"use client";

import React, { useState, useEffect } from "react";
import { getStudents } from "@/features/students/server/student-actions";
import { StJohnTemplatePreview } from "@/features/students/components/st-john-template-preview";
import { BulkA4Button } from "@/features/students/components/bulk-a4-btn";
import { SinglePrintButton } from "@/features/students/components/single-print-btn";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Search } from "lucide-react";

export function AdminPanel({ schools }: { schools: any[] }) {
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedSchool) {
      setLoading(true);
      getStudents(selectedSchool).then(res => {
        setStudents(res);
        setLoading(false);
      });
    } else {
      setStudents([]);
    }
  }, [selectedSchool]);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.className && s.className.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <span className="text-xl">🏫</span>
          </div>
          Select School
        </h2>
        <div className="relative">
          <select 
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full h-14 rounded-2xl border-2 border-slate-200 px-5 text-lg font-medium text-slate-700 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 appearance-none bg-slate-50 hover:bg-white cursor-pointer"
          >
            <option value="">-- Choose a School --</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.schoolName}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {selectedSchool && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Print Center</h2>
              <p className="text-slate-500 font-medium mt-1">Found {students.length} students ready for printing</p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <BulkA4Button selectedIds={filteredStudents.map(s => s.id)} />
            </div>
          </div>

          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
               <p className="text-slate-500 font-medium animate-pulse">Loading students...</p>
             </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Printer className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No students found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or add more students.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredStudents.map(student => (
                <div key={student.id} className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm hover:shadow-md">
                  <div className="w-full overflow-hidden flex justify-center items-center h-[280px] rounded-xl bg-white border border-slate-100 shadow-inner">
                    <div className="scale-[0.4] origin-center">
                      <StJohnTemplatePreview 
                        data={{
                          studentName: student.fullName,
                          fatherName: student.fatherName || "",
                          className: `${student.className || ""} ${student.section || ""}`.trim(),
                          dob: student.dateOfBirth ? student.dateOfBirth : "",
                          mobile: student.studentMobile || "",
                          address: student.addressLine1 || "",
                          photoUrl: student.photo || "",
                          schoolId: student.school.schoolCode,
                        }} 
                      />
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                     <SinglePrintButton studentId={student.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
