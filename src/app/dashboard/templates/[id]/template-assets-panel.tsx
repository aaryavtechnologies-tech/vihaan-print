"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  ImageIcon,
  PenLine,
  CheckCircle2,
  Loader2,
  X,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSchoolBranding } from "@/features/settings/server/settings-actions";

interface TemplateAssetsPanelProps {
  templateId: string;
  school: {
    id: string;
    schoolName: string;
    logo: string | null;
    principalSignature: string | null;
  } | null;
}

type UploadType = "logo" | "signature";

export function TemplateAssetsPanel({ school }: TemplateAssetsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [logoPreview, setLogoPreview] = useState<string | null>(school?.logo ?? null);
  const [sigPreview, setSigPreview] = useState<string | null>(school?.principalSignature ?? null);
  const [uploadingType, setUploadingType] = useState<UploadType | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);

  const handleFileSelect = (type: UploadType, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "logo") {
        setLogoPreview(e.target?.result as string);
        setLogoFile(file);
      } else {
        setSigPreview(e.target?.result as string);
        setSigFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File, type: UploadType): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `vihaan/schools/${school?.id}/${type}`);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleSave = async () => {
    if (!school) return;
    if (!logoFile && !sigFile) {
      toast.info("No changes to save.");
      return;
    }

    setUploadingType("logo");
    try {
      const updates: { logo?: string; principalSignature?: string } = {};

      if (logoFile) {
        setUploadingType("logo");
        const url = await uploadFile(logoFile, "logo");
        if (url) updates.logo = url;
      }
      if (sigFile) {
        setUploadingType("signature");
        const url = await uploadFile(sigFile, "signature");
        if (url) updates.principalSignature = url;
      }

      setUploadingType(null);

      startTransition(async () => {
        const result = await updateSchoolBranding(school.id, updates);
        if (result.success) {
          toast.success("School branding saved! It will appear on all new generated cards.");
          setLogoFile(null);
          setSigFile(null);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to save.");
        }
      });
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      setUploadingType(null);
    }
  };

  const DropZone = ({
    type,
    label,
    hint,
    preview,
    icon: Icon,
  }: {
    type: UploadType;
    label: string;
    hint: string;
    preview: string | null;
    icon: React.ElementType;
  }) => {
    const [dragging, setDragging] = useState(false);

    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-500" />
          {label}
        </p>
        <label
          className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"}`}
          style={{ minHeight: type === "logo" ? 180 : 140 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileSelect(type, file);
          }}
        >
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center p-4" style={{ minHeight: type === "logo" ? 180 : 140 }}>
              <img
                src={preview}
                alt={label}
                className={`object-contain ${type === "logo" ? "max-h-36 max-w-full" : "max-h-24 max-w-full"}`}
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full shadow p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (type === "logo") { setLogoPreview(school?.logo ?? null); setLogoFile(null); }
                  else { setSigPreview(school?.principalSignature ?? null); setSigFile(null); }
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center" style={{ minHeight: type === "logo" ? 180 : 140 }}>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-slate-700">Drop or click to upload</p>
              <p className="text-xs text-slate-400 mt-1">{hint}</p>
            </div>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(type, f); }}
          />
        </label>
      </div>
    );
  };

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-slate-200">
        <Building2 className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No school linked to this template.</p>
        <p className="text-slate-400 text-sm mt-1">Assign a school to manage its logo and signature here.</p>
      </div>
    );
  }

  const isBusy = uploadingType !== null || isPending;
  const hasChanges = logoFile !== null || sigFile !== null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DropZone
          type="logo"
          label="School Logo"
          hint="PNG, JPG, SVG (transparent BG recommended)"
          preview={logoPreview}
          icon={ImageIcon}
        />
        <DropZone
          type="signature"
          label="Principal Signature"
          hint="PNG with transparent background preferred"
          preview={sigPreview}
          icon={PenLine}
        />
      </div>

      {hasChanges && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          You have unsaved changes. Click "Save Branding" to apply them.
        </div>
      )}

      <Button
        id="save-branding-btn"
        onClick={handleSave}
        disabled={isBusy || !hasChanges}
        className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20 transition-all"
      >
        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {uploadingType === "logo" ? "Uploading Logo..." : uploadingType === "signature" ? "Uploading Signature..." : "Saving..."}
          </>
        ) : (
          "Save Branding"
        )}
      </Button>
    </div>
  );
}
