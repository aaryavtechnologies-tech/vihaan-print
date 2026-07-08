"use client";

import { useEffect, useState, useRef } from "react";
import { useImportStore } from "../../store/import-store";
import { createImportJob, importStudentChunk, completeImportJob } from "../../actions/import-actions";
import { uploadStudentPhoto } from "../../actions/photo-actions";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Step7Import() {
  const router = useRouter();
  const { 
    validationReport, setupContext, rawFile, photoMap, 
    importProgress, updateProgress, setJobId, jobId, reset 
  } = useImportStore();
  
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState({ imported: 0, failed: 0, skipped: 0, photosUploaded: 0 });
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current || !validationReport || !setupContext) return;
    hasStartedRef.current = true;
    startImport();
  }, []);

  const startImport = async () => {
    setIsImporting(true);
    updateProgress({ status: 'PROCESSING', current: 0, total: validationReport!.rows.length, percentage: 0 });

    try {
      // 1. Create Job
      const jobRes = await createImportJob({
        schoolId: setupContext!.schoolId,
        totalRecords: validationReport!.rows.length,
        fileName: rawFile?.name || "Unknown",
        fileSize: rawFile?.size || 0,
      });

      if (!jobRes.success || !jobRes.jobId) {
        throw new Error(jobRes.error || "Failed to create import job");
      }

      setJobId(jobRes.jobId);
      const currentJobId = jobRes.jobId;

      let imported = 0;
      let failed = 0;
      let currentProgress = 0;

      // 2. Process Data in Chunks
      const chunkSize = 500;
      for (let i = 0; i < validationReport!.rows.length; i += chunkSize) {
        const chunk = validationReport!.rows.slice(i, i + chunkSize);
        
        const res = await importStudentChunk(currentJobId, chunk, setupContext!.schoolId, setupContext?.templateId === 'none' ? undefined : setupContext?.templateId);
        
        if (res.success) {
          imported += res.imported || 0;
          failed += res.failed || 0;
        } else {
          failed += chunk.length;
        }

        currentProgress += chunk.length;
        updateProgress({ 
          current: currentProgress, 
          percentage: Math.round((currentProgress / validationReport!.rows.length) * 50) // Data import is 50% of progress
        });
      }

      // 3. Process Photos
      let photosUploaded = 0;
      const validRows = validationReport!.rows.filter(r => r._status !== "ERROR");
      
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        
        const possibleNames = [
          row.photoName,
          row.studentId ? \`\${row.studentId}.jpg\` : null,
          row.studentId ? \`\${row.studentId}.png\` : null,
          row.admissionNo ? \`\${row.admissionNo}.jpg\` : null,
          row.admissionNo ? \`\${row.admissionNo}.png\` : null,
        ].filter(Boolean) as string[];

        const matchedName = possibleNames.find(name => !!photoMap[name]);
        
        if (matchedName && row.studentId) {
          const photoFile = photoMap[matchedName];
          // Convert file to base64 for upload
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(photoFile);
          });

          await uploadStudentPhoto(row.studentId, setupContext!.schoolId, dataUrl, matchedName);
          photosUploaded++;
        }

        updateProgress({ 
          percentage: 50 + Math.round(((i + 1) / validRows.length) * 50) 
        });
      }

      // 4. Complete
      await completeImportJob(currentJobId, failed > 0 ? 'FAILED' : 'COMPLETED'); // Could use PARTIAL_SUCCESS but we only have FAILED/COMPLETED

      setResults({ imported, failed, skipped: validationReport!.skippedRows, photosUploaded });
      updateProgress({ status: 'COMPLETED', percentage: 100 });
      setIsImporting(false);

    } catch (error) {
      console.error(error);
      updateProgress({ status: 'FAILED' });
      setIsImporting(false);
    }
  };

  const handleFinish = () => {
    reset(); // Clear store memory
    router.push("/dashboard/students");
  };

  if (importProgress.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-bold text-slate-800">Import Failed</h3>
        <p className="text-slate-500 mt-2">A critical system error occurred during the import.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-8">Return to Dashboard</Button>
      </div>
    );
  }

  if (importProgress.status === 'COMPLETED') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Import Complete!</h2>
          <p className="text-slate-500 text-lg">Your data has been successfully imported into the system.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{results.imported}</div>
            <div className="text-sm font-medium text-slate-500">Records Imported</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{results.photosUploaded}</div>
            <div className="text-sm font-medium text-slate-500">Photos Uploaded</div>
          </div>
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-center">
            <div className="text-3xl font-bold text-amber-700 mb-1">{results.failed}</div>
            <div className="text-sm font-medium text-amber-600">Failed / Duplicates</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-1">{results.skipped}</div>
            <div className="text-sm font-medium text-slate-500">Empty Rows Skipped</div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleFinish}
            className="h-12 px-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold text-lg"
          >
            Go to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Importing Data...</h3>
      <p className="text-slate-500 mb-8">Please do not close this window or refresh the page.</p>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-600">
          <span>{importProgress.percentage < 50 ? "Importing Records" : "Uploading Photos"}</span>
          <span>{importProgress.percentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: \`\${importProgress.percentage}%\` }}
          />
        </div>
      </div>
    </div>
  );
}
