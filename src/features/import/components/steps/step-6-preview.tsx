"use client";

import { useMemo, useState } from "react";
import { useImportStore } from "../../store/import-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<any>();

export function Step6Preview() {
  const { validationReport, setValidationReport, nextStep, prevStep } = useImportStore();
  
  // Create a local copy of data for inline editing
  const [data, setData] = useState(() => validationReport?.rows || []);

  const columns = useMemo(() => [
    columnHelper.accessor("_status", {
      header: "Status",
      cell: info => {
        const status = info.getValue();
        if (status === "VALID") return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Valid</Badge>;
        if (status === "WARNING") return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>;
        if (status === "ERROR") return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
        return status;
      }
    }),
    columnHelper.accessor("studentId", { header: "Student ID" }),
    columnHelper.accessor("admissionNo", { header: "Adm No" }),
    columnHelper.accessor("firstName", { header: "First Name" }),
    columnHelper.accessor("lastName", { header: "Last Name" }),
    columnHelper.accessor("class", { header: "Class" }),
    columnHelper.accessor("section", { header: "Section" }),
    columnHelper.accessor("_errors", {
      header: "Details",
      cell: info => {
        const errors = info.getValue() as string[];
        const warnings = info.row.original._warnings as string[];
        if (errors?.length > 0) return <div className="text-red-600 text-xs">{errors[0]}</div>;
        if (warnings?.length > 0) return <div className="text-amber-600 text-xs">{warnings[0]}</div>;
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      }
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleNext = () => {
    // Save any inline edits back to the store
    if (validationReport) {
      setValidationReport({ ...validationReport, rows: data });
    }
    nextStep();
  };

  const errorCount = data.filter(r => r._status === "ERROR").length;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Preview Data</h2>
        <p className="text-slate-500">Review your data before the final import. Only Valid and Warning rows will be imported.</p>
      </div>

      {errorCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
          <div>
            <h4 className="font-semibold">Action Required</h4>
            <p className="text-sm mt-1">There are {errorCount} rows with errors. They will be skipped during import unless fixed.</p>
          </div>
        </div>
      )}

      <div className="border border-slate-200/60 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 font-semibold text-slate-600 whitespace-nowrap">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg shadow-sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg shadow-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Begin Import
        </Button>
      </div>
    </div>
  );
}
