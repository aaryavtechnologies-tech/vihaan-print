"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Sparkles, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button";

interface ImageUploadWithBgRemovalProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUploadWithBgRemoval({ value, onChange, label = "Upload Photo", folder = "vihaan_id_print/stjohn" }: ImageUploadWithBgRemovalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Editor states
  const [step, setStep] = useState<"idle" | "edit" | "uploaded">(value ? "uploaded" : "idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Reset if value becomes empty externally
  useEffect(() => {
    if (!value) {
      setStep("idle");
      setPreviewUrl(null);
      setBrightness(100);
      setContrast(100);
    } else {
      setStep("uploaded");
    }
  }, [value]);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProcessStatus("Removing Background...");
    
    try {
      // 1. Remove Background
      const imageBlob = await removeBackground(file);
      
      // 2. Read Blob as DataURL for preview/editing
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setStep("edit");
        setIsProcessing(false);
        setProcessStatus("");
      };
      reader.onerror = () => {
        throw new Error("Failed to read image");
      };
      reader.readAsDataURL(imageBlob);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to process photo.");
      setIsProcessing(false);
      setProcessStatus("");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const uploadAdjustedImage = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setProcessStatus("Applying Filters...");

    try {
      // Create an image element to get natural dimensions
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      // Use a Promise to wait for image load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Export to Blob
      setProcessStatus("Uploading...");
      const finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        }, "image/png", 1.0);
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", finalBlob, "photo.png");
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
      setStep("uploaded");
      toast.success("Photo processed and uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload adjusted photo.");
    } finally {
      setIsProcessing(false);
      setProcessStatus("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    processFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setStep("idle");
    setPreviewUrl(null);
    setBrightness(100);
    setContrast(100);
  };

  if (step === "edit" && previewUrl) {
    return (
      <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-800 flex items-center mb-4">
          <SlidersHorizontal className="w-4 h-4 mr-2 text-blue-500" />
          Adjust Photo
        </h4>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 aspect-[4/5] w-[160px] bg-checkerboard">
              {/* Checkerboard background for transparency */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjBmMGYwIi8+CjxyZWN0IHg9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZjBmMGYwIi8+Cjwvc3ZnPg==')] opacity-50 z-0"></div>
              
              {/* Actual Image with CSS filters */}
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="relative z-10 w-full h-full object-cover object-top"
                style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
              />
              
              {isProcessing && (
                <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                  <span className="text-xs font-bold text-blue-700">{processStatus}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700">Brightness</label>
                <span className="text-xs text-slate-500 font-mono">{brightness}%</span>
              </div>
              <input 
                type="range" 
                min="50" max="150" value={brightness} 
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-600"
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700">Contrast</label>
                <span className="text-xs text-slate-500 font-mono">{contrast}%</span>
              </div>
              <input 
                type="range" 
                min="50" max="150" value={contrast} 
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-600"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep("idle")}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={uploadAdjustedImage}
                disabled={isProcessing}
              >
                {isProcessing ? "Uploading..." : "Confirm Photo"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {step === "uploaded" && value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-[4/5] max-w-[200px] bg-white shadow-sm flex items-center justify-center">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover object-top" />
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
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer aspect-[4/5] max-w-[200px]",
            isProcessing ? "bg-blue-50 border-blue-300" : "bg-slate-50 hover:bg-slate-100 border-slate-300"
          )}
        >
          {isProcessing ? (
            <>
              <div className="relative mb-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-sm font-bold text-blue-700 text-center animate-pulse">
                {processStatus}
              </span>
              <span className="text-xs text-blue-500 mt-2 text-center">AI is working...</span>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold text-slate-700 text-center">
                {label}
              </span>
              <span className="text-xs text-slate-500 mt-2 text-center px-2">
                Auto bg-removal & crop
              </span>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isProcessing}
      />
    </div>
  );
}
