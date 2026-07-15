"use client";

import React, { useEffect, useState } from "react";
import { Printer, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { clearStudentImages } from "../server/student-actions";
import { toast } from "sonner";

export function PrintController({ children, studentId }: { children: React.ReactNode, studentId?: string }) {
  const router = useRouter();

  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Optionally trigger print automatically when page loads
    // setTimeout(() => window.print(), 500);
  }, []);

  const handlePrint = () => {
    window.print();
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
      <div className="flex gap-4 mb-8 print:hidden">
        <Button variant="outline" onClick={() => router.back()} className="bg-white shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Printer className="w-4 h-4 mr-2" /> Print ID Card
        </Button>
        {studentId && (
          <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="shadow-sm">
            <Trash2 className="w-4 h-4 mr-2" /> {isClearing ? "Clearing..." : "Clear Cloudinary Images"}
          </Button>
        )}
      </div>

      {/* Printable Area - We use scale down for screen viewing but allow print CSS to dictate print size */}
      <div className="bg-white p-8 shadow-xl print:shadow-none print:p-0 rounded-xl print:rounded-none overflow-hidden">
        
        {/* Helper text for user - hidden on print */}
        <div className="text-center mb-6 text-slate-500 text-sm print:hidden max-w-md">
          Make sure your printer settings are set to "Print Background Colors" or "Background Graphics" for the colors to show up correctly.
        </div>

        {/* The actual ID card (scaled slightly for screen preview) */}
        <div className="transform scale-[0.6] sm:scale-[0.8] origin-top print:scale-100 print:origin-top-left">
          {children}
        </div>
      </div>
    </div>
  );
}
