import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Printer } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function GeneratedCardDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const card = await prisma.generatedCard.findUnique({
    where: { id },
    include: {
      school: true,
      student: true,
      template: true,
    }
  });

  if (!card) return notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/generated-cards">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Card Details</h1>
          <p className="text-slate-500 font-medium mt-1">
            {card.student.fullName} - {card.school.schoolName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Previews */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-inner flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="space-y-4 text-center">
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-100 bg-white" style={{ width: 300, height: 477 }}>
                {card.frontImage ? (
                  <Image src={card.frontImage} alt="Front" fill className="object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Front Image</div>
                )}
              </div>
              <p className="font-semibold text-slate-700">Front</p>
            </div>

            {card.template.orientation === "portrait" && card.backImage && (
              <div className="space-y-4 text-center">
                <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-100 bg-white" style={{ width: 300, height: 477 }}>
                  <Image src={card.backImage} alt="Back" fill className="object-contain" />
                </div>
                <p className="font-semibold text-slate-700">Back</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-4">Metadata</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Status</span>
                  <Badge variant="outline">{card.status}</Badge>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Student ID</span>
                  <span className="font-medium text-slate-900">{card.student.studentId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Template</span>
                  <span className="font-medium text-slate-900">{card.template.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Generated</span>
                  <span className="font-medium text-slate-900">{format(new Date(card.generatedAt), "PPP p")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <a href={card.frontImage ? `/api/proxy-download?url=${encodeURIComponent(card.frontImage)}&filename=${encodeURIComponent(card.student.studentId + "_front.png")}` : "#"}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md h-11">
                  <Download className="w-4 h-4 mr-2" /> Download Front
                </Button>
              </a>
              {card.backImage && (
                <a href={`/api/proxy-download?url=${encodeURIComponent(card.backImage)}&filename=${encodeURIComponent(card.student.studentId + "_back.png")}`}>
                  <Button variant="outline" className="w-full rounded-xl shadow-sm h-11">
                    <Download className="w-4 h-4 mr-2" /> Download Back
                  </Button>
                </a>
              )}
              <Link href="/dashboard/print">
                <Button variant="secondary" className="w-full rounded-xl shadow-sm h-11 mt-4">
                  <Printer className="w-4 h-4 mr-2" /> Send to Print Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
