"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useEditorStore } from "../../store/editor-store";
import { CanvasRulers } from "./canvas-rulers";
import { AlignmentToolbar } from "../toolbar/alignment-toolbar";

// Konva components must be loaded client-side only
const CanvasBackground = dynamic(() => import("./canvas-background"), { ssr: false });

export function CanvasWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { zoomLevel, canvasPosition, setCanvasPosition } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    observer.observe(containerRef.current);
    
    // Initial dimensions
    setDimensions({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    
    return () => observer.disconnect();
  }, []);

  // For infinite panning feel
  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default zoom if ctrl is pressed (browser zoom)
    if (e.ctrlKey) return;
    
    setCanvasPosition({
      x: canvasPosition.x - e.deltaX,
      y: canvasPosition.y - e.deltaY,
    });
  };

  const [isPanMode, setIsPanMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.code === "Space") {
        setIsPanMode(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsPanMode(false);
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanMode) {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanMode && isDragging) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      setCanvasPosition({
        x: canvasPosition.x + dx,
        y: canvasPosition.y + dy,
      });
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden outline-none ${isPanMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
    >
      <CanvasRulers width={dimensions.width} height={dimensions.height} />
      <AlignmentToolbar />
      
      <div 
        className={`absolute inset-0 z-0 origin-top-left ${isPanMode ? 'pointer-events-none' : ''}`}
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoomLevel})`,
          transition: isDragging ? "none" : "transform 0.1s ease-out"
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {dimensions.width > 0 && <CanvasBackground />}
        </div>
      </div>
    </div>
  );
}
