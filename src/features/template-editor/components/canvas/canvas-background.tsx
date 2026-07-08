"use client";

import { Stage, Layer, Rect } from "react-konva";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";
import { GridOverlay } from "./grid-overlay";
import { useEditorStore } from "../../store/editor-store";
import { ElementsRenderer } from "./ElementsRenderer";
import { TransformerNode } from "./TransformerNode";
import { useState } from "react";
import Konva from "konva";

export default function CanvasBackground() {
  const { gridEnabled, elements, setSelectedObjectId } = useEditorStore();
  const [selectedNode, setSelectedNode] = useState<Konva.Node | null>(null);
  
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
      <Stage 
        width={width} 
        height={height}
        onMouseDown={(e) => {
          // Deselect when clicking on empty stage area
          const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "bg-rect";
          if (clickedOnEmpty) {
            setSelectedObjectId(null);
            setSelectedNode(null);
          }
        }}
        onTap={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "bg-rect";
          if (clickedOnEmpty) {
            setSelectedObjectId(null);
            setSelectedNode(null);
          }
        }}
      >
        <Layer>
          {/* Main Card Background */}
          <Rect
            name="bg-rect"
            x={0}
            y={0}
            width={width}
            height={height}
            fill="#ffffff"
          />

          {/* Grid Overlay Placeholder */}
          {gridEnabled && <GridOverlay width={width} height={height} />}
          
          {/* Dynamic Elements */}
          <ElementsRenderer 
            elements={elements} 
            onSelect={(node) => setSelectedNode(node)} 
          />

          {/* Selection Transformer */}
          <TransformerNode selectedNode={selectedNode} />
        </Layer>
      </Stage>
    </div>
  );
}
