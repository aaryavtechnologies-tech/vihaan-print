"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getStudents, deleteStudent } from "@/features/students/server/student-actions";
import { StJohnTemplatePreview } from "@/features/students/components/st-john-template-preview";
import { BulkA4Button } from "@/features/students/components/bulk-a4-btn";
import { SinglePrintButton } from "@/features/students/components/single-print-btn";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Search, Trash2, AlertTriangle, X, Filter, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function AdminPanel({ schools }: { schools: any[] }) {
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch students whenever selected school changes (or fetch all if "ALL" selected)
  useEffect(() => {
    setLoading(true);
    getStudents(selectedSchool || undefined).then((res) => {
      setStudents(res);
      setLoading(false);
    });
  }, [selectedSchool]);

  // Comprehensive multi-field search filter (Name, Father's Name, Class, ID, Mobile)
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;

    return students.filter((s) => {
      const nameMatch = s.fullName?.toLowerCase().includes(term) || 
                         s.firstName?.toLowerCase().includes(term) || 
                         s.lastName?.toLowerCase().includes(term);
      const fatherMatch = s.fatherName?.toLowerCase().includes(term);
      const classMatch = s.className?.toLowerCase().includes(term);
      const idMatch = s.studentId?.toLowerCase().includes(term) || s.admissionNo?.toLowerCase().includes(term);
      const mobileMatch = s.studentMobile?.includes(term);
      const schoolMatch = s.school?.schoolName?.toLowerCase().includes(term);

      return nameMatch || fatherMatch || classMatch || idMatch || mobileMatch || schoolMatch;
    });
  }, [students, searchTerm]);

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteStudent(studentToDelete.id);
      if (res.success) {
        setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
        toast.success(`Deleted ID card for ${studentToDelete.name}`);
        setStudentToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete student ID card");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Search & Filter Bar Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              Student ID Card Search & Management
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Search any student card by name, father's name, class, ID, or mobile number.
            </p>
          </div>

          {filteredStudents.length > 0 && (
            <BulkA4Button selectedIds={filteredStudents.map((s) => s.id)} />
          )}
        </div>

        {/* Controls: Search Bar + School Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Main Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Student Name, Father's Name, Class, Student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-10 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-base font-medium transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* School Selector Filter */}
          <div className="md:col-span-4 relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full h-14 rounded-2xl border-2 border-slate-200 px-4 text-base font-semibold text-slate-700 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 appearance-none bg-slate-50 hover:bg-white cursor-pointer pr-10"
            >
              <option value="">🏫 All Schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.schoolName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Results Counter Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-blue-600">{filteredStudents.length}</strong> of {students.length} cards
            </span>
            {searchTerm && (
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                Query: "{searchTerm}"
              </Badge>
            )}
          </div>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Main Student Cards Grid */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading ID cards...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No matching student ID cards</h3>
            <p className="text-slate-500 mt-2 max-w-md">
              No ID cards matched standard query <span className="font-semibold text-slate-800">"{searchTerm}"</span>. Try searching with a different name or class.
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="mt-6 rounded-xl border-slate-300"
              >
                Clear Search Query
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center bg-slate-50/50 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md group relative"
              >
                {/* Student Info Header */}
                <div className="w-full flex items-center justify-between mb-3 px-1">
                  <div className="truncate pr-2">
                    <h4 className="font-bold text-slate-900 truncate uppercase text-sm">
                      {student.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Class: {student.className || "-"} • ID: {student.studentId || "-"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase border-slate-200 bg-white shrink-0">
                    {student.school?.schoolName?.split(" ")[0] || "Card"}
                  </Badge>
                </div>

                {/* ID Card Visual Preview */}
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
                        schoolId: student.school?.schoolCode || "STJOHN-9780",
                      }}
                    />
                  </div>
                </div>

                {/* Print & Delete Action Buttons */}
                <div className="mt-5 w-full flex items-center gap-3">
                  <div className="flex-1">
                    <SinglePrintButton studentId={student.id} />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setStudentToDelete({ id: student.id, name: student.fullName })}
                    className="h-12 w-12 shrink-0 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border-slate-200 hover:border-red-200 transition-colors shadow-sm"
                    title="Delete Student Card"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl bg-white shadow-2xl border border-slate-100">
          <DialogHeader className="text-center sm:text-left space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto sm:mx-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Delete Student ID Card?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Are you sure you want to delete the ID card for{" "}
              <strong className="text-slate-900 uppercase">{studentToDelete?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStudentToDelete(null)}
              disabled={isDeleting}
              className="flex-1 h-11 rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-500/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Card
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
