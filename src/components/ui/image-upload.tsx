"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Crop, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PassportCropModal } from "@/components/ui/passport-crop-modal";
import { Badge } from "@/components/ui/badge";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  enableAutoCrop?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Passport Photo",
  folder = "vihaan_id_print/students",
  enableAutoCrop = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing photo...");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image must be less than 15MB");
      return;
    }

    if (enableAutoCrop) {
      // Read image as Data URL for interactive passport cropping modal
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setSelectedImageSrc(dataUrl);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      // Direct upload without modal if auto crop is disabled
      uploadFileBlob(file, file.name || "photo.jpg");
    }

    if (inputRef.current) {
      inputRef.current.value = ""; // Reset input so same file can be re-selected
    }
  };

  const uploadFileBlob = async (blob: Blob | File, filename = "passport_photo.jpg") => {
    setIsUploading(true);
    setLoadingText("Uploading passport photo...");

    try {
      const formData = new FormData();
      formData.append("file", blob, filename);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Passport photo cropped & uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setLoadingText("Processing...");
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    uploadFileBlob(croppedBlob, "passport_cropped.jpg");
  };

  const handleRemove = () => {
    onChange("");
    setSelectedImageSrc(null);
  };

  const handleReCrop = () => {
    if (value) {
      setSelectedImageSrc(value);
      setIsCropModalOpen(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {value ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative group rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-lg aspect-[1.25/1.75] w-[180px] bg-slate-900">
            <img
              src={value}
              alt="Passport Photo"
              className="w-full h-full object-cover"
            />

            {/* Passport Size Badge overlay */}
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] px-2 py-0.5 shadow-sm font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 1.25" × 1.75" Passport
              </Badge>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReCrop}
                title="Adjust Crop"
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-transform hover:scale-110 shadow-md flex items-center justify-center"
              >
                <Crop className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                title="Remove Photo"
                className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-md flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReCrop}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline mt-1"
          >
            <Crop className="w-3.5 h-3.5" /> Adjust Passport Framing
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer aspect-[1.25/1.75] w-[180px] group relative overflow-hidden",
            isUploading
              ? "bg-blue-50/50 border-blue-300"
              : "bg-slate-50 hover:bg-blue-50/40 border-slate-300 hover:border-blue-500 shadow-sm hover:shadow-md"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <span className="text-xs font-bold text-blue-700">
                {loadingText}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100/80 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors block">
                  {label}
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                  Passport Cropper
                </span>
              </div>
              {enableAutoCrop && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-semibold text-blue-600 border-blue-200 bg-blue-50/80 px-2 py-0.5 rounded-full"
                >
                  <Sparkles className="w-2.5 h-2.5 mr-1" /> 1.25" × 1.75"
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      {/* Passport Cropping Modal */}
      <PassportCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}


