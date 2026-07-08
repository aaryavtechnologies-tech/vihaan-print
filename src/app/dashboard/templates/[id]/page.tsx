import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutTemplate,
  Building2,
  ImageIcon,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TemplateAssetsPanel } from "./template-assets-panel";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await prisma.template.findUnique({ where: { id } });
  return { title: `${template?.name ?? "Template"} | VIHAAN ID PRINT` };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      school: {
        select: {
          id: true,
          schoolName: true,
          schoolCode: true,
          logo: true,
          principalSignature: true,
        },
      },
      currentVersion: true,
    },
  });

  if (!template) notFound();

  const statusColor =
    template.status === "PUBLISHED"
      ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
      : template.status === "DRAFT"
      ? "bg-amber-500/10 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="space-y-6 pb-10">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/templates"
            className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Templates
          </Link>
        </div>
        <Link href={`/dashboard/templates/${id}/editor`}>
          <Button className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20">
            <Edit3 className="w-4 h-4 mr-2" /> Open Editor
          </Button>
        </Link>
      </div>

      {/* Title block */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <LayoutTemplate className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {template.name}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
            >
              {template.status}
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            {template.school?.schoolName ?? "Global Template"} &bull;{" "}
            {template.orientation === "portrait" ? "Portrait" : "Landscape"} &bull; Version{" "}
            {template.currentVersion?.version ?? 1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Thumbnail preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Template Preview</h2>
            </div>
            <div className="aspect-[3/4] bg-slate-50 flex items-center justify-center">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <LayoutTemplate className="w-16 h-16 mb-2" />
                  <p className="text-sm">No preview available</p>
                </div>
              )}
            </div>
          </div>

          {/* School info card */}
          {template.school && (
            <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-700">Linked School</h3>
              </div>
              <p className="text-slate-800 font-medium">{template.school.schoolName}</p>
              <p className="text-slate-400 text-xs font-mono mt-0.5">{template.school.schoolCode}</p>
            </div>
          )}
        </div>

        {/* Right: Branding uploader */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                School Branding
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload the school logo and principal signature. These will be embedded into
                every ID card generated from this template.
              </p>
            </div>
            <div className="p-6">
              <TemplateAssetsPanel
                templateId={id}
                school={template.school}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
