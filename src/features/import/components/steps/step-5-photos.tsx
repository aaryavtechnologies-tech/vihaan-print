"use client";

import { useState, useRef } from "react";
import { useImportStore } from "../../store/import-store";
import { Button } from "@/components/ui/button";
import { UploadCloud, FolderArchive, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

export function Step5Photos() {
  const { parsedData, photoMap, addPhotos, nextStep, prevStep } = useImportStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZip = async (file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast.error("Please upload a valid ZIP file containing photos.");
      return;
    }

    setIsExtracting(true);
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      const newPhotos: Record<string, File> = {};
      
      for (const [filename, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir) {
          // Check if it's an image
          const ext = filename.split('.').pop()?.toLowerCase();
          if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
            const blob = await zipEntry.async("blob");
            // Use just the basename without folders
            const baseName = filename.split('/').pop() || filename;
            newPhotos[baseName] = new File([blob], baseName, { type: `image/${ext === 'jpg' ? 'jpeg' : ext}` });
          }
        }
      }

      const count = Object.keys(newPhotos).length;
      if (count === 0) {
        toast.error("No valid images (jpg/png) found in the ZIP file.");
      } else {
        addPhotos(newPhotos);
        toast.success(`Successfully extracted ${count} photos.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract ZIP file.");
    } finally {
      setIsExtracting(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleZip(e.dataTransfer.files[0]);
    }
  };

  // Match statistics
  const totalStudents = parsedData?.length || 0;
  let matchedCount = 0;
  
  parsedData?.forEach(row => {
    // We try to match by studentId.jpg, admissionNo.jpg, or the specific mapped photoName
    const possibleNames = [
      row.photoName,
      row.studentId ? `${row.studentId}.jpg` : null,
      row.studentId ? `${row.studentId}.png` : null,
      row.admissionNo ? `${row.admissionNo}.jpg` : null,
      row.admissionNo ? `${row.admissionNo}.png` : null,
    ].filter(Boolean) as string[];

    const hasMatch = possibleNames.some(name => !!photoMap[name]);
    if (hasMatch) matchedCount++;
  });

  const photoCount = Object.keys(photoMap).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Upload Photos (Optional)</h2>
        <p className="text-slate-500">Upload a ZIP file containing student photos. Name them by Student ID or Admission No.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all duration-200 h-[280px] ${
            isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".zip"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleZip(e.target.files[0]);
              }
            }}
          />

          <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
            {isExtracting ? (
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            ) : (
              <FolderArchive className="h-8 w-8 text-blue-500" />
            )}
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-1 text-center">
            {isExtracting ? "Extracting..." : "Upload ZIP File"}
          </h3>
          <p className="text-slate-500 text-xs text-center">
            Drag and drop or click
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" /> Uploaded Photos
            </h4>
            <p className="text-3xl font-bold text-slate-900">{photoCount}</p>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="space-y-1">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-Matched
            </h4>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-emerald-600">{matchedCount}</p>
              <p className="text-sm font-medium text-slate-500">/ {totalStudents} students</p>
            </div>
            {totalStudents > 0 && matchedCount < totalStudents && (
              <p className="text-xs text-amber-600 mt-1">Missing {totalStudents - matchedCount} photos</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Preview Data
        </Button>
      </div>
    </div>
  );
}
