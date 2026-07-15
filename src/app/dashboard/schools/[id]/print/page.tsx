import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StJohnTemplatePreview } from "@/features/students/components/st-john-template-preview";
import { Printer, FileImage } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { PrintButton } from "@/components/dashboard/print-button";

export const metadata = {
  title: "Print ID Cards | Admin",
};

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // First, find the school
  let school = await prisma.school.findUnique({
    where: { id: id },
  });

  // If not found by CUID, try by schoolCode (e.g. STJOHN-9780)
  if (!school) {
    school = await prisma.school.findUnique({
      where: { schoolCode: id },
    });
  }

  if (!school) {
    notFound();
  }

  const students = await prisma.student.findMany({
    where: { schoolId: school.id },
    orderBy: { createdAt: "desc" },
  });

  // Map to preview data
  const cardData = students.map(s => ({
    studentName: s.fullName,
    fatherName: s.fatherName || "",
    className: s.className || "",
    dob: s.dateOfBirth || "",
    mobile: s.studentMobile || "",
    address: s.addressLine1 || "",
    photoUrl: s.photo || undefined,
    principalSignUrl: s.signature || undefined, // assuming signature is used for principal
  }));

  // Group into pages of 10 for A4
  const a4Pages = [];
  for (let i = 0; i < cardData.length; i += 10) {
    a4Pages.push(cardData.slice(i, i + 10));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Print ID Cards: {school.schoolName}</h1>
          <p className="text-slate-500">Total Cards: {students.length}</p>
        </div>
        <PrintButton />
      </div>

      <div className="no-print">
        <Tabs defaultValue="a4" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="a4">A4 Sheet (10 Cards)</TabsTrigger>
            <TabsTrigger value="single">Single ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="a4" className="mt-6 border p-4 bg-slate-50 rounded-xl overflow-x-auto">
            <p className="text-sm text-slate-500 mb-4">Cards are arranged 2x5 to fit exactly on an A4 sheet. Click Print Now and ensure 'Scale: Default' and 'Paper size: A4' are set.</p>
            {/* We render a preview of the print layout */}
            <div className="print-layout-container">
              {a4Pages.map((page, pageIndex) => (
                <div key={pageIndex} className="a4-page-preview bg-white shadow-xl mx-auto mb-8 border" style={{ width: '210mm', height: '297mm', padding: '10mm', boxSizing: 'border-box' }}>
                  <div className="grid grid-cols-2 gap-x-[10mm] gap-y-[10mm] justify-center items-center h-full">
                    {page.map((data, i) => (
                      <div key={i} className="card-wrapper flex justify-center items-center" style={{ width: '86mm', height: '54mm', overflow: 'hidden' }}>
                         {/* We scale the 1016x638 template down to 86x54mm. 86mm is ~325px at 96 DPI screen. Scale factor = 325 / 1016 = 0.32 */}
                         <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left' }}>
                           <StJohnTemplatePreview data={data} zoom={1} />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="single" className="mt-6 border p-4 bg-slate-50 rounded-xl">
             <p className="text-sm text-slate-500 mb-4">Single ID View. Use this if you are printing directly to a PVC Card printer.</p>
             <div className="flex flex-wrap gap-6 justify-center">
                {cardData.map((data, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-md">
                     <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '406px', height: '255px' }}>
                       <StJohnTemplatePreview data={data} zoom={1} />
                     </div>
                  </div>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Actual Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .a4-page-preview {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
          }
          .a4-page-preview * {
            visibility: visible;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          /* Override scale for printing at 300DPI physical size */
          /* 86mm / 1016px = 0.0846 scale? No, 86mm is 1016px at 300dpi, but CSS uses 96dpi. */
          /* At 96 DPI, 86mm = 325px. So scale = 325/1016 = 0.32 */
        }
      `}} />
    </div>
  );
}
