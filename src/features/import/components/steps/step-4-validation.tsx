"use client";

import { useEffect, useState } from "react";
import { useImportStore, ValidationReport } from "../../store/import-store";
import { validateImportChunk } from "../../actions/validation-actions";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle, XCircle, SkipForward } from "lucide-react";
import { toast } from "sonner";

export function Step4Validation() {
  const { parsedData, mappedColumns, setupContext, setValidationReport, nextStep, prevStep } = useImportStore();
  const [isValidating, setIsValidating] = useState(true);
  const [report, setReport] = useState<ValidationReport | null>(null);

  useEffect(() => {
    async function performValidation() {
      if (!parsedData || !mappedColumns.length || !setupContext) return;

      // Map raw data to DB schema format
      const transformedData = parsedData.map(row => {
        const mappedRow: any = {};
        mappedColumns.forEach(mapping => {
          if (mapping.fileHeader) {
            mappedRow[mapping.dbField] = row[mapping.fileHeader];
          }
        });
        
        // Apply setup context defaults if missing
        if (!mappedRow.class && setupContext.className) mappedRow.class = setupContext.className;
        if (!mappedRow.section && setupContext.section) mappedRow.section = setupContext.section;
        
        return mappedRow;
      });

      // Filter out entirely empty rows
      const dataToValidate = transformedData.filter(row => 
        Object.values(row).some(val => val !== "" && val !== null && val !== undefined)
      );

      // Validate in chunks of 500
      const chunkSize = 500;
      let allValidatedRows: any[] = [];
      let totalValid = 0;
      let totalWarnings = 0;
      let totalErrors = 0;

      for (let i = 0; i < dataToValidate.length; i += chunkSize) {
        const chunk = dataToValidate.slice(i, i + chunkSize);
        const result = await validateImportChunk(chunk, setupContext.schoolId);
        
        if (!result.success || !result.data) {
          toast.error("Validation failed");
          setIsValidating(false);
          return;
        }

        allValidatedRows = [...allValidatedRows, ...result.data];
        
        result.data.forEach((r: any) => {
          if (r._status === "VALID") totalValid++;
          if (r._status === "WARNING") totalWarnings++;
          if (r._status === "ERROR") totalErrors++;
        });
      }

      const finalReport = {
        totalRows: dataToValidate.length,
        validRows: totalValid,
        warningRows: totalWarnings,
        errorRows: totalErrors,
        skippedRows: parsedData.length - dataToValidate.length,
        rows: allValidatedRows
      };

      setReport(finalReport);
      setValidationReport(finalReport);
      setIsValidating(false);
    }

    performValidation();
  }, []);

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-slate-800">Validating Data...</h3>
        <p className="text-slate-500 mt-2">Checking for duplicates, required fields, and formatting.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Validation Report</h2>
        <p className="text-slate-500">Review the health of your imported data.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold text-slate-800 mb-1">{report?.totalRows}</div>
          <div className="text-sm font-medium text-slate-500">Total Records</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
          <div className="text-3xl font-bold text-emerald-700 mb-1">{report?.validRows}</div>
          <div className="text-sm font-medium text-emerald-600">Valid to Import</div>
        </div>
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
          <div className="text-3xl font-bold text-amber-700 mb-1">{report?.warningRows}</div>
          <div className="text-sm font-medium text-amber-600">Warnings</div>
        </div>
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center">
          <XCircle className="w-6 h-6 text-red-500 mb-2" />
          <div className="text-3xl font-bold text-red-700 mb-1">{report?.errorRows}</div>
          <div className="text-sm font-medium text-red-600">Errors</div>
        </div>
      </div>

      {report?.skippedRows ? (
        <div className="bg-slate-50 px-6 py-4 rounded-xl flex items-center gap-3 border border-slate-200">
          <SkipForward className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-600"><strong>{report.skippedRows} empty rows</strong> were detected and skipped automatically.</span>
        </div>
      ) : null}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Review Data & Photos
        </Button>
      </div>
    </div>
  );
}
