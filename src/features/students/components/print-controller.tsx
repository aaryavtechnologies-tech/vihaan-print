"use client";

import React, { useEffect, useState, useRef } from "react";
import { Printer, ArrowLeft, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearStudentImages } from "../server/student-actions";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function PrintController({ children, studentId }: { children: React.ReactNode, studentId?: string }) {
  const router = useRouter();

  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optionally trigger print automatically when page loads
    // setTimeout(() => window.print(), 500);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportImage = async (format: 'png' | 'jpg') => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      // Create a clone or just render the current ref
      // We use html-to-image on the card container
      const options = {
        pixelRatio: 4, // Higher scale for high quality ID card
        backgroundColor: 'transparent',
      };
      
      let dataUrl: string;
      if (format === 'jpg') {
        // JPG doesn't support transparency, so use white background
        dataUrl = await htmlToImage.toJpeg(cardRef.current, { ...options, backgroundColor: '#ffffff' });
      } else {
        dataUrl = await htmlToImage.toPng(cardRef.current, options);
      }
      
      const link = document.createElement('a');
      link.download = `student-id-${studentId || 'card'}.${format}`;
      link.href = dataUrl;
      link.click();
      
      toast.success(`ID Card exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export image. Make sure all images have loaded.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    if (!studentId) return;
    if (!confirm("Are you sure you want to clear the images from Cloudinary for this student? This cannot be undone.")) return;
    
    setIsClearing(true);
    try {
      const res = await clearStudentImages(studentId);
      if (res.success) {
        toast.success("Images and generated card cleared from Cloudinary.");
        router.refresh();
      } else {
        toast.error("Failed to clear images: " + res.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center py-10 print:bg-white print:py-0">
      
      {/* Non-printable Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 print:hidden">
        <Button variant="outline" onClick={() => router.back()} className="bg-white shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 shadow-sm text-white">
          <Printer className="w-4 h-4 mr-2" /> Print ID Card
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isExporting} variant="outline" className="bg-white shadow-sm text-slate-800 border-slate-200">
              <Download className="w-4 h-4 mr-2" /> 
              {isExporting ? "Exporting..." : "Export as Image"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExportImage('jpg')} className="cursor-pointer">
              Download as JPG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportImage('png')} className="cursor-pointer">
              Download as PNG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {studentId && (
          <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="shadow-sm">
            <Trash2 className="w-4 h-4 mr-2" /> {isClearing ? "Clearing..." : "Clear Cloudinary Images"}
          </Button>
        )}
      </div>

      {/* Printable Area - We use scale down for screen viewing but allow print CSS to dictate print size */}
      <div className="bg-white p-8 md:p-12 shadow-xl print:shadow-none print:p-0 rounded-xl print:rounded-none flex flex-col items-center justify-center min-h-[500px] w-full max-w-3xl">
        
        {/* Helper text for user - hidden on print */}
        <div className="text-center mb-6 text-slate-500 text-sm print:hidden max-w-md">
          Make sure your printer settings are set to "Print Background Colors" or "Background Graphics" for the colors to show up correctly.
        </div>

        {/* The actual ID card (scaled slightly for screen preview) */}
        <div className="transform scale-[1.25] sm:scale-[1.75] md:scale-[2] print:scale-100 origin-top mt-4 mb-24 sm:mb-40 md:mb-52 print:my-0">
          <div ref={cardRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
