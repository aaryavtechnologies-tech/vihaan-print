"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  Printer,
  ChevronDown,
  X,
  AlertTriangle,
  Users,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { deleteStudent, bulkDeleteStudents } from "@/features/students/server/student-actions";

type Student = {
  id: string;
  studentId: string;
  fullName: string;
  className: string | null;
  section: string | null;
  status: string;
  school: { schoolName: string; schoolCode: string };
};

interface StudentListClientProps {
  students: Student[];
}

export function StudentListClient({ students }: StudentListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSchool, setFilterSchool] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm delete state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null); // "bulk" | student.id
  const [isDeleting, setIsDeleting] = useState(false);

  // Unique filter options
  const classes = useMemo(() => [...new Set(students.map(s => s.className).filter(Boolean))].sort(), [students]);
  const sections = useMemo(() => [...new Set(students.map(s => s.section).filter(Boolean))].sort(), [students]);
  const statuses = useMemo(() => [...new Set(students.map(s => s.status))].sort(), [students]);
  const schools = useMemo(() => [...new Set(students.map(s => s.school.schoolName))].sort(), [students]);

  // Filtered students
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(s => {
      const matchSearch = !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.school.schoolName.toLowerCase().includes(q);
      const matchClass = !filterClass || s.className === filterClass;
      const matchSection = !filterSection || s.section === filterSection;
      const matchStatus = !filterStatus || s.status === filterStatus;
      const matchSchool = !filterSchool || s.school.schoolName === filterSchool;
      return matchSearch && matchClass && matchSection && matchStatus && matchSchool;
    });
  }, [students, search, filterClass, filterSection, filterStatus, filterSchool]);

  // Select all (only filtered)
  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      filtered.forEach(s => checked ? next.add(s.id) : next.delete(s.id));
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setFilterClass("");
    setFilterSection("");
    setFilterStatus("");
    setFilterSchool("");
  };

  const hasFilters = search || filterClass || filterSection || filterStatus || filterSchool;

  // Delete single
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    startTransition(async () => {
      await deleteStudent(id);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      setDeleteConfirm(null);
      setIsDeleting(false);
      router.refresh();
    });
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    startTransition(async () => {
      await bulkDeleteStudents([...selectedIds]);
      setSelectedIds(new Set());
      setDeleteConfirm(null);
      setIsDeleting(false);
      router.refresh();
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "VERIFIED": return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "INACTIVE": return "bg-slate-100 text-slate-600 border-slate-200";
      case "ARCHIVED": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="student-search"
            placeholder="Search by name, ID or school..."
            className="pl-9 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500 h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Class filter */}
          <div className="relative">
            <select
              id="filter-class"
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="appearance-none pl-3 pr-8 h-10 text-sm rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Classes</option>
              {classes.map(c => <option key={c!} value={c!}>{c}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Section filter */}
          <div className="relative">
            <select
              id="filter-section"
              value={filterSection}
              onChange={e => setFilterSection(e.target.value)}
              className="appearance-none pl-3 pr-8 h-10 text-sm rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Sections</option>
              {sections.map(s => <option key={s!} value={s!}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              id="filter-status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 h-10 text-sm rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* School filter */}
          <div className="relative">
            <select
              id="filter-school"
              value={filterSchool}
              onChange={e => setFilterSchool(e.target.value)}
              className="appearance-none pl-3 pr-8 h-10 text-sm rounded-xl border border-slate-200 bg-white shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Schools</option>
              {schools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {hasFilters && (
            <Button
              id="clear-filters"
              variant="ghost"
              size="sm"
              className="h-10 px-3 text-slate-500 hover:text-slate-900"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-sm font-semibold text-blue-700">
            {selectedIds.size} student{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <Button
            id="bulk-delete-btn"
            variant="destructive"
            size="sm"
            className="h-8 rounded-lg ml-auto"
            onClick={() => setDeleteConfirm("bulk")}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete Selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-slate-500"
            onClick={() => setSelectedIds(new Set())}
          >
            Deselect All
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
          <span className="font-semibold text-slate-700">{students.length}</span> students
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-slate-200/60 rounded-3xl bg-white shadow-sm">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No students found</h3>
          <p className="text-slate-400 text-sm mb-4">Try adjusting your search or filters</p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl">
              <X className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="border border-slate-100 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <Checkbox
                      id="select-all"
                      checked={allFilteredSelected}
                      onCheckedChange={(v) => toggleSelectAll(!!v)}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-4 font-semibold text-slate-600">Student ID</th>
                  <th className="px-4 py-4 font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-4 font-semibold text-slate-600">Class</th>
                  <th className="px-4 py-4 font-semibold text-slate-600">School</th>
                  <th className="px-4 py-4 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => {
                  const isSelected = selectedIds.has(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-4 py-3.5">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(student.id)}
                          aria-label={`Select ${student.fullName}`}
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                        {student.studentId}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-900">{student.fullName}</td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {student.className}{student.section ? ` - ${student.section}` : ""}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">{student.school.schoolName}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-xs shadow-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
                          >
                            <Link href={`/dashboard/students/print/${student.id}`} target="_blank">
                              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
                            </Link>
                          </Button>
                          <Button
                            id={`delete-student-${student.id}`}
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-xs shadow-sm text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-all"
                            onClick={() => setDeleteConfirm(student.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteConfirm(null)}
          />
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {deleteConfirm === "bulk"
                    ? `Delete ${selectedIds.size} Students?`
                    : "Delete Student?"}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {deleteConfirm === "bulk"
                    ? `This will permanently delete ${selectedIds.size} student record${selectedIds.size > 1 ? "s" : ""}. This cannot be undone.`
                    : "This will permanently delete the student record. This cannot be undone."}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                id="confirm-delete-btn"
                variant="destructive"
                className="rounded-xl"
                disabled={isDeleting}
                onClick={() =>
                  deleteConfirm === "bulk"
                    ? handleBulkDelete()
                    : handleDelete(deleteConfirm)
                }
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
