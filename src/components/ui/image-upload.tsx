"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", folder = "vihaan_id_print/students" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("removeBg", removeBg.toString());

    try {
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
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = ""; // Reset input
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[3/4] max-w-[200px]">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer aspect-[3/4] max-w-[200px]",
            isUploading ? "bg-slate-50 border-slate-300" : "bg-slate-50 hover:bg-slate-100 border-slate-200"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
          )}
          <span className="text-sm font-medium text-slate-600 text-center">
            {isUploading ? "Uploading..." : label}
          </span>
          <span className="text-xs text-slate-400 mt-1">JPG, PNG (Max 5MB)</span>
        </div>
      )}
      
      {!value && (
        <div className="mt-3 flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            id="removeBg"
            checked={removeBg}
            onChange={(e) => setRemoveBg(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            disabled={isUploading}
          />
          <label htmlFor="removeBg" className="text-xs font-medium text-slate-600 cursor-pointer">
            Remove Background (AI)
          </label>
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
