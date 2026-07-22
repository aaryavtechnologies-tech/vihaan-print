"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  enableAutoCrop?: boolean;
}

/**
 * Automatically crops an image file to standard 3.5 x 4.5 passport aspect ratio
 * using HTML5 Canvas without requiring manual user crop adjustments.
 */
async function autoCropPassportImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.onload = () => {
        try {
          const PASSPORT_ASPECT_RATIO = 3.5 / 4.5;
          const EXPORT_WIDTH = 600;
          const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH / PASSPORT_ASPECT_RATIO); // 771px

          const canvas = document.createElement("canvas");
          canvas.width = EXPORT_WIDTH;
          canvas.height = EXPORT_HEIGHT;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not create canvas context"));
            return;
          }

          // Fill clean white background (passport standard)
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);

          const imgAspect = img.naturalWidth / img.naturalHeight;
          let srcX = 0;
          let srcY = 0;
          let srcW = img.naturalWidth;
          let srcH = img.naturalHeight;

          if (imgAspect > PASSPORT_ASPECT_RATIO) {
            // Image is wider than 3.5:4.5 - crop sides, keep center
            srcH = img.naturalHeight;
            srcW = img.naturalHeight * PASSPORT_ASPECT_RATIO;
            srcX = (img.naturalWidth - srcW) / 2;
            srcY = 0;
          } else {
            // Image is taller than 3.5:4.5 - crop top/bottom with top-bias for faces
            srcW = img.naturalWidth;
            srcH = img.naturalWidth / PASSPORT_ASPECT_RATIO;
            srcX = 0;
            // 15% offset from top so head/face is nicely centered in passport frame
            srcY = (img.naturalHeight - srcH) * 0.15;
            if (srcY < 0) srcY = 0;
            if (srcY + srcH > img.naturalHeight) srcY = img.naturalHeight - srcH;
          }

          ctx.drawImage(
            img,
            srcX,
            srcY,
            srcW,
            srcH,
            0,
            0,
            EXPORT_WIDTH,
            EXPORT_HEIGHT
          );

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Failed to generate passport image blob"));
            },
            "image/jpeg",
            0.95
          );
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
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

    try {
      if (enableAutoCrop) {
        setIsUploading(true);
        setLoadingText("Auto-cropping to 3.5×4.5...");
        const croppedBlob = await autoCropPassportImage(file);
        await uploadFileBlob(croppedBlob, "passport_cropped.jpg");
      } else {
        await uploadFileBlob(file, file.name || "photo.jpg");
      }
    } catch (error) {
      console.error("Auto crop error:", error);
      // Fallback to direct upload if canvas processing encounters any issue
      uploadFileBlob(file, file.name || "photo.jpg");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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
      toast.success(enableAutoCrop ? "Photo auto-cropped & uploaded!" : "Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setLoadingText("Processing...");
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full flex flex-col items-center">
      {value ? (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative group rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-lg aspect-[3.5/4.5] w-[180px] bg-slate-900">
            <img
              src={value}
              alt="Passport Photo"
              className="w-full h-full object-cover"
            />

            {/* Passport Size Badge overlay */}
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] px-2 py-0.5 shadow-sm font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {enableAutoCrop ? "3.5×4.5 Passport (Auto)" : "Uploaded"}
              </Badge>
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
        </div>
      ) : (
        <div
          onClick={() => !isUploading && inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer aspect-[3.5/4.5] w-[180px] group relative overflow-hidden",
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
                  {enableAutoCrop ? "Auto Passport Crop" : "Direct Upload"}
                </span>
              </div>
              {enableAutoCrop && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-semibold text-blue-600 border-blue-200 bg-blue-50/80 px-2 py-0.5 rounded-full"
                >
                  <Sparkles className="w-2.5 h-2.5 mr-1" /> 3.5×4.5 cm Auto
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
    </div>
  );
}

