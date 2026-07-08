"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useEditorStore } from "../../store/editor-store";
import { CanvasRulers } from "./canvas-rulers";

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

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing outline-none"
      onWheel={handleWheel}
      tabIndex={0}
    >
      <CanvasRulers width={dimensions.width} height={dimensions.height} />
      
      <div 
        className="absolute inset-0 z-0 origin-top-left"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${zoomLevel})`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {dimensions.width > 0 && <CanvasBackground />}
        </div>
      </div>
    </div>
  );
}
