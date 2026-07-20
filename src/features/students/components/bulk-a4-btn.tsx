"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { getStudentsByIds } from "../server/student-actions";
import { StJohnTemplatePreview } from "./st-john-template-preview";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { format } from "date-fns";
import JSZip from "jszip";

interface BulkA4ButtonProps {
  selectedIds: string[];
}

export function BulkA4Button({ selectedIds }: BulkA4ButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderData, setRenderData] = useState<any[][] | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Fetch full student data
      const students = await getStudentsByIds(selectedIds);
      
      // 2. Map to preview data
      const mapped = students.map(student => ({
        studentName: student.fullName,
        fatherName: student.fatherName || "",
        className: `${student.className || ""} ${student.section || ""}`.trim(),
        dob: student.dateOfBirth ? format(new Date(student.dateOfBirth), "dd/MM/yyyy") : "",
        mobile: student.studentMobile || "",
        address: student.addressLine1 || "",
        photoUrl: student.photo || "",
        schoolId: student.school.schoolCode,
      }));

      // 3. Chunk into groups of 10 (for 2x5 grid per A4 page)
      const chunks: any[][] = [];
      for (let i = 0; i < mapped.length; i += 10) {
        chunks.push(mapped.slice(i, i + 10));
      }
      
      // We will render them off-screen temporarily, wait a moment for fonts/images to load, then capture
      setRenderData(chunks);
      
      // Wait for React to render the DOM and for images to load
      await new Promise(r => setTimeout(r, 2000));
      
      const blobs: Blob[] = [];
      
      // Capture each page
      for (let i = 0; i < chunks.length; i++) {
        const element = document.getElementById(`a4-page-render-${i}`);
        if (element) {
          const dataUrl = await toPng(element, { quality: 1, pixelRatio: 1 });
          // Convert dataURL to Blob
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          blobs.push(blob);
        }
      }
      
      // Download
      if (blobs.length === 1) {
        const url = URL.createObjectURL(blobs[0]);
        const link = document.createElement("a");
        link.href = url;
        link.download = `A4_Students_${new Date().getTime()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (blobs.length > 1) {
        const zip = new JSZip();
        blobs.forEach((blob, index) => {
          zip.file(`A4_Students_Page_${index + 1}.png`, blob);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `A4_Students_Batch_${new Date().getTime()}.zip`;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success("A4 Image generated successfully!");
      setRenderData(null); // Cleanup
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate A4 images. Please try again.");
      setRenderData(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || selectedIds.length === 0}
        variant="default"
        size="lg"
        className="h-12 rounded-xl shadow-lg font-bold px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
      >
        {isGenerating ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating A4...</>
        ) : (
          <><Printer className="w-5 h-5 mr-2" /> Bulk Print A4 (10 per page)</>
        )}
      </Button>

      {/* Hidden Render Area */}
      {renderData && (
        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
          {renderData.map((chunk, pageIndex) => (
            <div 
              key={pageIndex} 
              id={`a4-page-render-${pageIndex}`}
              className="bg-white relative overflow-hidden flex items-center justify-center" 
              style={{ width: '2480px', height: '3508px', padding: '100px' }} // 300 DPI A4 Size
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 40px', justifyContent: 'center', alignContent: 'center' }}>
                {chunk.map((student, i) => (
                  <div key={i} className="relative shadow-sm border border-slate-200 rounded-2xl overflow-hidden" style={{ width: '1016px', height: '638px' }}>
                    <StJohnTemplatePreview data={student} zoom={1} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
