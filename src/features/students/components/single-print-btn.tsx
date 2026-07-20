"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { getStudentById } from "../server/student-actions";
import { StJohnTemplatePreview } from "./st-john-template-preview";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { format } from "date-fns";

export function SinglePrintButton({ studentId }: { studentId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderData, setRenderData] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const student = await getStudentById(studentId);
      if (!student) throw new Error("Student not found");
      
      const mapped = {
        studentName: student.fullName,
        fatherName: student.fatherName || "",
        className: `${student.className || ""} ${student.section || ""}`.trim(),
        dob: student.dateOfBirth ? format(new Date(student.dateOfBirth), "dd/MM/yyyy") : "",
        mobile: student.studentMobile || "",
        address: student.addressLine1 || "",
        photoUrl: student.photo || "",
        schoolId: student.school.schoolCode,
      };

      setRenderData(mapped);
      
      // Wait for React to render the DOM and for images to load
      await new Promise(r => setTimeout(r, 1000));
      
      const element = document.getElementById(`single-card-render-${studentId}`);
      if (element) {
        const dataUrl = await toPng(element, { quality: 1, pixelRatio: 1 });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `ID_Card_${student.fullName.replace(/\s+/g, '_')}.png`;
        link.click();
        toast.success("ID Card generated successfully!");
      }
      
      setRenderData(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate ID Card. Please try again.");
      setRenderData(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        variant="outline"
        className="w-full h-10 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold shadow-sm"
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
        ) : (
          <><Printer className="w-4 h-4 mr-2" /> Print Single Card</>
        )}
      </Button>

      {/* Hidden Render Area */}
      {renderData && (
        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
          <div 
            id={`single-card-render-${studentId}`}
            className="bg-white relative overflow-hidden" 
            style={{ width: '1016px', height: '638px' }}
          >
            <StJohnTemplatePreview data={renderData} zoom={1} />
          </div>
        </div>
      )}
    </>
  );
}
