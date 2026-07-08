"use client";

import { useSchoolFilters } from "@/store/school-store";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolStatus, SchoolType } from "@/types/school";

export function SchoolFilters() {
  const { 
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    boardFilter, setBoardFilter,
    resetFilters
  } = useSchoolFilters();

  const hasActiveFilters = statusFilter !== "ALL" || boardFilter !== "ALL" || searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search by school name, code, city..." 
          className="pl-9 h-10 w-full bg-white dark:bg-slate-950"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as string)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-950">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value={SchoolStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={SchoolStatus.INACTIVE}>Inactive</SelectItem>
            <SelectItem value={SchoolStatus.ARCHIVED}>Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={boardFilter} onValueChange={(val) => setBoardFilter(val as string)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-950">
            <SelectValue placeholder="Board" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Boards</SelectItem>
            <SelectItem value="CBSE">CBSE</SelectItem>
            <SelectItem value="ICSE">ICSE</SelectItem>
            <SelectItem value="State Board">State Board</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-2 lg:px-3 text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline-block">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}
