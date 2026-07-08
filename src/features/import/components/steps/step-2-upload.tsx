"use client";

import { useState, useRef } from "react";
import { useImportStore } from "../../store/import-store";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export function Step2Upload() {
  const { setFileData, nextStep, prevStep } = useImportStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 100MB.");
      return;
    }

    setIsParsing(true);
    
    try {
      let headers: string[] = [];
      let data: any[] = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) {
          console.warn("CSV parse warnings:", result.errors);
        }
        headers = result.meta.fields || [];
        data = result.data;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        
        if (json.length > 0) {
          headers = Object.keys(json[0]);
          data = json;
        }
      } else {
        toast.error("Unsupported file type. Please upload a CSV or Excel file.");
        setIsParsing(false);
        return;
      }

      if (data.length === 0 || headers.length === 0) {
        toast.error("The uploaded file appears to be empty.");
        setIsParsing(false);
        return;
      }

      if (data.length > 100000) {
        toast.error("File contains too many records. Maximum is 100,000.");
        setIsParsing(false);
        return;
      }

      setFileData(file, headers, data);
      nextStep();
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse the file. Please ensure it's a valid CSV/Excel file.");
    } finally {
      setIsParsing(false);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Upload Data</h2>
        <p className="text-slate-500">Upload your student list in CSV or Excel format (Max 100MB / 100k records).</p>
      </div>

      <div 
        className={\`relative flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-3xl transition-all duration-200 \${
          isDragging ? "border-blue-500 bg-blue-50 scale-105" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }\`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
          {isParsing ? (
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-10 w-10 text-blue-500" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {isParsing ? "Parsing File..." : "Click or drag file to upload"}
        </h3>
        <p className="text-slate-500 text-sm max-w-sm text-center">
          Supports .CSV, .XLS, .XLSX files. 
        </p>

        {!isParsing && (
          <Button variant="outline" className="mt-8 rounded-xl h-11 px-6 shadow-sm border-slate-200">
            <UploadCloud className="mr-2 w-4 h-4" /> Browse Files
          </Button>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="h-12 px-8 rounded-xl shadow-sm"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
