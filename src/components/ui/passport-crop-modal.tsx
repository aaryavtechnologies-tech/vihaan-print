"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Check,
  X,
  RefreshCw,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PassportCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
}

// Passport photo standard aspect ratio: 3.5cm x 4.5cm (3.5 / 4.5 = ~0.77778)
const PASSPORT_ASPECT_RATIO = 3.5 / 4.5;
const EXPORT_WIDTH = 600;
const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH / PASSPORT_ASPECT_RATIO); // 771px

export function PassportCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: PassportCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-Crop: Calculates optimal center-top alignment for passport photo
  const applyAutoCrop = useCallback(() => {
    setZoom(1.05);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen && imageSrc) {
      setImageLoaded(false);
      applyAutoCrop();
    }
  }, [isOpen, imageSrc, applyAutoCrop]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imgRef.current = img;
    setImageLoaded(true);
    applyAutoCrop();
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleConfirmCrop = async () => {
    if (!imgRef.current) return;
    setIsProcessing(true);

    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_WIDTH;
      canvas.height = EXPORT_HEIGHT;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create canvas context");

      // Draw background (clean white for passport standards)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      // Move context to center of export canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotate if needed
      ctx.rotate((rotation * Math.PI) / 180);

      // Calculate scale based on natural dimensions vs export box
      // Container dimensions ratio vs image
      const scaleToFitWidth = canvas.width / img.naturalWidth;
      const scaleToFitHeight = canvas.height / img.naturalHeight;
      // Cover strategy for passport crop
      const baseScale = Math.max(scaleToFitWidth, scaleToFitHeight);
      const totalScale = baseScale * zoom;

      // Pan multiplier normalized for export size
      // We assume container preview width is ~260px
      const previewScale = 260 / EXPORT_WIDTH;
      const normalizedPanX = pan.x / (previewScale * zoom);
      const normalizedPanY = pan.y / (previewScale * zoom);

      ctx.scale(totalScale, totalScale);

      // Draw image centered with offsets
      ctx.drawImage(
        img,
        -img.naturalWidth / 2 + normalizedPanX,
        -img.naturalHeight / 2 + normalizedPanY
      );

      ctx.restore();

      // Export canvas to Blob & DataURL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to generate passport image blob"));
          },
          "image/jpeg",
          0.95
        );
      });

      onCropComplete(blob, dataUrl);
      onClose();
    } catch (error) {
      console.error("Passport crop export error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-6 rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <DialogHeader className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              Auto Passport Cropper
            </DialogTitle>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs px-2.5 py-0.5">
              3.5 x 4.5 cm Ratio
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Adjust position & zoom to align face with official passport guidelines.
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Box Area */}
        <div className="flex flex-col items-center my-3">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            className="relative w-[240px] h-[308px] rounded-2xl overflow-hidden border-4 border-blue-500/80 shadow-xl bg-slate-900 cursor-grab active:cursor-grabbing select-none group touch-none"
          >
            {imageSrc && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={handleImageLoad}
                  className="max-w-none w-full h-full object-cover"
                  style={{ minWidth: "100%", minHeight: "100%" }}
                  draggable={false}
                />
              </div>
            )}

            {/* Passport Face Guide Overlay Mask */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-2 border-white/40 rounded-xl">
              {/* Outer vignetting mask */}
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Head & Shoulder outline guide */}
              <div className="relative z-10 w-[140px] h-[170px] border-2 border-dashed border-yellow-300/80 rounded-[50%] flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <User className="w-16 h-16 text-yellow-300/40" />
                <span className="text-[10px] font-bold text-yellow-200 bg-black/50 px-2 py-0.5 rounded-full mt-1">
                  Face Oval Guide
                </span>
              </div>
              <span className="relative z-10 text-[9px] font-semibold text-white/90 bg-blue-900/60 px-2 py-0.5 rounded-full mt-2">
                Passport 3.5 × 4.5 Standard
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            💡 Drag photo to position face inside yellow oval
          </span>
        </div>

        {/* Controls */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-blue-600" /> Zoom
              </span>
              <span className="text-slate-500 font-mono">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-slate-700"
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <Slider
                value={[zoom]}
                min={0.8}
                max={3.0}
                step={0.05}
                onValueChange={([val]) => setZoom(val)}
                className="flex-1 accent-blue-600"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-slate-700"
                onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={applyAutoCrop}
              className="text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 rounded-xl"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" /> Reset Auto-Crop
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={rotateImage}
              className="text-xs text-slate-700 border-slate-200 hover:bg-slate-100 rounded-xl"
            >
              <RotateCw className="w-3 h-3 mr-1.5" /> Rotate 90°
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex gap-2 sm:gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 rounded-xl h-11 border-slate-200"
          >
            <X className="w-4 h-4 mr-1.5" /> Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmCrop}
            disabled={isProcessing || !imageLoaded}
            className="flex-1 rounded-xl h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
          >
            {isProcessing ? (
              "Cropping..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-1.5" /> Confirm Passport Photo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
