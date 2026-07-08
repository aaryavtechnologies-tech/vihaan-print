"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  label: string;
  description?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  label,
  description = "PNG, JPG, WEBP up to 5MB",
  maxSizeMB = 5,
  className
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "vihaan_id_print/schools");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please check your Cloudinary configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Remove
          </button>
        )}
      </div>

      <div
        onClick={() => !value && !isUploading && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-lg border-2 border-dashed transition-all",
          value ? "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900" : 
          isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-copy" 
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={onFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Uploading image...</p>
          </div>
        ) : value ? (
          <div className="relative w-full h-full p-2 group">
            <div className="relative w-full h-40 rounded overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image 
                src={value} 
                alt="Preview" 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
               <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md backdrop-blur-sm text-sm font-medium transition-colors"
               >
                 Replace Image
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium mb-1">Click or drag image to upload</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
