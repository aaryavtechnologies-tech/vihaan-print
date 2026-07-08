"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { School } from "@prisma/client";
import { SchoolTable } from "./school-table";
import { SchoolFilters } from "./school-filters";
import { useSchoolFilters, useSchoolTableStore } from "@/store/school-store";
import { deleteSchool, archiveSchool, restoreSchool, bulkDeleteSchools, bulkArchiveSchools } from "@/actions/schools";
import { Button } from "@/components/ui/button";
import { Trash2, Archive, RotateCcw } from "lucide-react";

interface SchoolListClientProps {
  initialSchools: School[];
}

export function SchoolListClient({ initialSchools }: SchoolListClientProps) {
  const { searchQuery, statusFilter, boardFilter } = useSchoolFilters();
  const { selectedRowIds, clearSelection } = useSchoolTableStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredSchools = useMemo(() => {
    return initialSchools.filter(school => {
      const matchesSearch = 
        school.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.schoolCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || school.status === statusFilter;
      const matchesBoard = boardFilter === "ALL" || (school.board && school.board.includes(boardFilter));

      return matchesSearch && matchesStatus && matchesBoard;
    });
  }, [initialSchools, searchQuery, statusFilter, boardFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    
    setIsProcessing(true);
    const result = await deleteSchool(id);
    if (result.success) toast.success("School deleted");
    else toast.error(result.error);
    setIsProcessing(false);
  };

  const handleArchive = async (id: string) => {
    setIsProcessing(true);
    const result = await archiveSchool(id);
    if (result.success) toast.success("School archived");
    else toast.error(result.error);
    setIsProcessing(false);
  };

  const handleRestore = async (id: string) => {
    setIsProcessing(true);
    const result = await restoreSchool(id);
    if (result.success) toast.success("School restored");
    else toast.error(result.error);
    setIsProcessing(false);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedRowIds.length} schools?`)) return;
    setIsProcessing(true);
    const result = await bulkDeleteSchools(selectedRowIds);
    if (result.success) {
      toast.success(`${selectedRowIds.length} schools deleted`);
      clearSelection();
    } else {
      toast.error(result.error);
    }
    setIsProcessing(false);
  };

  const handleBulkArchive = async () => {
    setIsProcessing(true);
    const result = await bulkArchiveSchools(selectedRowIds);
    if (result.success) {
      toast.success(`${selectedRowIds.length} schools archived`);
      clearSelection();
    } else {
      toast.error(result.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex-1 w-full">
          <SchoolFilters />
        </div>
        
        {selectedRowIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-blue-100 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-sm font-semibold text-blue-900 mr-2">{selectedRowIds.length} school(s) selected</span>
            <Button variant="outline" size="sm" onClick={handleBulkArchive} disabled={isProcessing} className="shadow-sm border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-lg">
              <Archive className="h-4 w-4 mr-2" /> Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isProcessing} className="shadow-sm bg-red-600 hover:bg-red-700 rounded-lg">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>

      <SchoolTable 
        schools={filteredSchools} 
        onDelete={handleDelete}
        onArchive={handleArchive}
        onRestore={handleRestore}
      />
    </div>
  );
}
