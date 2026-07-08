"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
  Archive,
  RotateCcw,
  Building2,
} from "lucide-react";
import Image from "next/image";

import type { School } from "@prisma/client";
import { SchoolStatus } from "@/types/school";
import { useSchoolTableStore } from "@/store/school-store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface SchoolTableProps {
  schools: School[];
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export function SchoolTable({ schools, onDelete, onArchive, onRestore }: SchoolTableProps) {
  const { selectedRowIds, toggleRow, toggleAll } = useSchoolTableStore();

  const handleSelectAll = (checked: boolean) => {
    toggleAll(schools.map(s => s.id), checked);
  };

  const getStatusBadge = (status: SchoolStatus) => {
    switch (status) {
      case SchoolStatus.ACTIVE:
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">Active</Badge>;
      case SchoolStatus.INACTIVE:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600">Inactive</Badge>;
      case SchoolStatus.ARCHIVED:
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/60 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No schools found</h3>
        <p className="text-slate-500 font-medium max-w-sm mb-6">
          There are no schools matching your search or filters. Try adjusting them or create a new school.
        </p>
        <Link href="/dashboard/schools/new">
          <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all font-semibold">
            Add New School
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="w-[40px] px-4">
                <Checkbox 
                  checked={selectedRowIds.length === schools.length && schools.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>School Info</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.map((school) => {
              const isSelected = selectedRowIds.includes(school.id);
              
              return (
                <TableRow 
                  key={school.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={isSelected ? "bg-blue-50/50 border-slate-100" : "border-slate-100 hover:bg-slate-50/50"}
                >
                  <TableCell className="px-4">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleRow(school.id)}
                      aria-label={`Select ${school.schoolName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {school.logo ? (
                          <Image src={school.logo} alt={school.schoolName} fill className="object-contain p-1" />
                        ) : (
                          <Building2 className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 line-clamp-1">{school.schoolName}</span>
                        <span className="text-xs text-slate-500 font-medium">{school.schoolType.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{school.schoolCode}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{school.phone}</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">{school.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{school.city}</span>
                      <span className="text-xs text-slate-500">{school.state}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(school.status as any)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {format(new Date(school.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      {/* @ts-ignore */}
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/schools/${school.id}`}>
                          {/* @ts-ignore */}
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/schools/${school.id}/edit`}>
                          {/* @ts-ignore */}
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Edit School
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        
                        {school.status === SchoolStatus.ARCHIVED ? (
                          // @ts-ignore
                          <DropdownMenuItem onClick={() => onRestore(school.id)} className="cursor-pointer text-emerald-600">
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore
                          </DropdownMenuItem>
                        ) : (
                          // @ts-ignore
                          <DropdownMenuItem onClick={() => onArchive(school.id)} className="cursor-pointer text-amber-600">
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                        )}
                        
                        {/* @ts-ignore */}
                        <DropdownMenuItem onClick={() => onDelete(school.id)} className="cursor-pointer text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
