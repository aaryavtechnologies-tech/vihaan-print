"use client";

import { useEffect, useState } from "react";
import { useImportStore, MappedColumn } from "../../store/import-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle } from "lucide-react";

const REQUIRED_DB_FIELDS = [
  { key: "studentId", label: "Student ID", required: true, aliases: ["id", "sid", "student_id", "student id", "studentcode"] },
  { key: "firstName", label: "First Name", required: true, aliases: ["name", "firstname", "first name", "candidate name", "full name", "fullname"] },
  { key: "middleName", label: "Middle Name", required: false, aliases: ["middlename", "middle name"] },
  { key: "lastName", label: "Last Name", required: false, aliases: ["lastname", "last name", "surname"] },
  { key: "admissionNo", label: "Admission No", required: false, aliases: ["adm no", "admission no", "adm_no", "admission_no", "admission number"] },
  { key: "rollNo", label: "Roll No", required: false, aliases: ["roll", "rollno", "roll no", "roll_no", "roll number"] },
  { key: "class", label: "Class", required: false, aliases: ["class", "grade", "standard"] },
  { key: "section", label: "Section", required: false, aliases: ["section", "sec"] },
  { key: "fatherName", label: "Father Name", required: false, aliases: ["father", "fname", "father name", "father's name"] },
  { key: "motherName", label: "Mother Name", required: false, aliases: ["mother", "mname", "mother name", "mother's name"] },
  { key: "dob", label: "Date of Birth", required: false, aliases: ["dob", "date of birth", "birthdate"] },
  { key: "gender", label: "Gender", required: false, aliases: ["gender", "sex"] },
  { key: "bloodGroup", label: "Blood Group", required: false, aliases: ["blood group", "blood", "bg", "bloodgroup"] },
  { key: "mobile", label: "Mobile", required: false, aliases: ["mobile", "phone", "contact", "student mobile"] },
  { key: "email", label: "Email", required: false, aliases: ["email", "e-mail"] },
  { key: "address", label: "Address", required: false, aliases: ["address", "addr", "address line 1"] },
  { key: "photoName", label: "Photo Filename", required: false, aliases: ["photo", "image", "photo name", "filename", "photo file"] },
];

export function Step3Mapping() {
  const { fileHeaders, setMappedColumns, nextStep, prevStep } = useImportStore();
  const [mappings, setMappings] = useState<MappedColumn[]>([]);

  // Smart Auto-Mapping on Mount
  useEffect(() => {
    const autoMapped: MappedColumn[] = REQUIRED_DB_FIELDS.map(field => {
      // Find a matching header using aliases
      const match = fileHeaders.find(h => {
        const normalizedHeader = h.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
        const normalizedAliases = field.aliases.map(a => a.toLowerCase().replace(/[^a-z0-9]/g, ""));
        return normalizedAliases.includes(normalizedHeader) || normalizedHeader.includes(field.key.toLowerCase());
      });

      return {
        dbField: field.key,
        fileHeader: match || null
      };
    });

    setMappings(autoMapped);
  }, [fileHeaders]);

  const handleMappingChange = (dbField: string, fileHeader: string) => {
    setMappings(prev => prev.map(m => 
      m.dbField === dbField ? { ...m, fileHeader: fileHeader === "none" ? null : fileHeader } : m
    ));
  };

  const handleNext = () => {
    setMappedColumns(mappings);
    nextStep();
  };

  const missingRequired = REQUIRED_DB_FIELDS
    .filter(f => f.required)
    .filter(f => !mappings.find(m => m.dbField === f.key)?.fileHeader);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Map Columns</h2>
        <p className="text-slate-500">We've auto-matched your columns. Please verify the mapping below.</p>
      </div>

      {missingRequired.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">Missing Required Fields</h4>
            <p className="text-sm mt-1">Please map the following required fields to continue: {missingRequired.map(f => f.label).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="border border-slate-200/60 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-1/3">System Field</TableHead>
              <TableHead className="w-2/3">Your File Column</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REQUIRED_DB_FIELDS.map(field => {
              const currentMapping = mappings.find(m => m.dbField === field.key)?.fileHeader;
              
              return (
                <TableRow key={field.key} className={currentMapping ? "bg-white" : "bg-slate-50/50"}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {currentMapping ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4" />}
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={currentMapping || "none"} 
                      onValueChange={(val) => handleMappingChange(field.key, val)}
                    >
                      <SelectTrigger className="w-full bg-white max-w-sm rounded-xl">
                        <SelectValue placeholder="Select column from your file" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Do not map --</SelectItem>
                        {fileHeaders.map(header => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          disabled={missingRequired.length > 0} 
          onClick={handleNext}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Validate Data
        </Button>
      </div>
    </div>
  );
}
