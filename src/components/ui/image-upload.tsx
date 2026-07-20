"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", folder = "vihaan_id_print/students" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);
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

  const handleRemoveBg = async () => {
    if (!value) return;
    setIsRemovingBg(true);
    setBgProgress(0);
    
    try {
      // Create a blob from the image URL to pass to imgly
      const response = await fetch(value);
      const blob = await response.blob();
      
      const imageBlob = await removeBackground(blob, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("compute")) {
            setBgProgress(Math.round((current / total) * 100));
          }
        }
      });
      
      // Upload the new image without background
      setBgProgress(100); // Indicate uploading phase
      
      const formData = new FormData();
      formData.append("file", imageBlob, "nobg.png");
      formData.append("folder", folder);
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const data = await uploadResponse.json();
      onChange(data.url);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove background.");
    } finally {
      setIsRemovingBg(false);
      setBgProgress(0);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="flex flex-col gap-3">
          <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[3/4] max-w-[200px]">
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            
            {isRemovingBg && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <span className="text-xs font-bold text-blue-700 animate-pulse">
                  {bgProgress === 100 ? "Uploading..." : `Processing ${bgProgress}%`}
                </span>
              </div>
            )}
            
            {!isRemovingBg && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveBg}
            disabled={isRemovingBg}
            className="w-full max-w-[200px] border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Remove BG (AI)
          </Button>
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
