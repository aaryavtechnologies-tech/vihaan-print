"use client";

import { Stage, Layer, Rect, Group } from "react-konva";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";
import { GridOverlay } from "./grid-overlay";
import { useEditorStore } from "../../store/editor-store";

export default function CanvasBackground() {
  const { gridEnabled } = useEditorStore();
  
  const width = EDITOR_CONSTANTS.CARD_WIDTH_PX;
  const height = EDITOR_CONSTANTS.CARD_HEIGHT_PX;

  return (
    <div 
      className="shadow-2xl" 
      style={{ 
        width, 
        height, 
        backgroundColor: "white" 
      }}
    >
      <Stage width={width} height={height}>
        <Layer>
          {/* Main Card Background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#ffffff"
          />

          {/* Grid Overlay Placeholder */}
          {gridEnabled && <GridOverlay width={width} height={height} />}
          
          {/* Objects placeholder logic will go here in Phase 6.2 */}
        </Layer>
      </Stage>
    </div>
  );
}
