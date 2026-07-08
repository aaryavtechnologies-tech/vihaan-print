"use client";

import { Stage, Layer, Rect } from "react-konva";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";
import { GridOverlay } from "./grid-overlay";
import { useEditorStore } from "../../store/editor-store";
import { ElementsRenderer } from "./ElementsRenderer";
import { TransformerNode } from "./TransformerNode";
import { useSmartGuides } from "../../hooks/useSmartGuides";
import { useRef, useState } from "react";
import Konva from "konva";
import { Line } from "react-konva";

export default function CanvasBackground() {
  const { gridEnabled, snapEnabled, elements, setSelectedObjectIds } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);
  const [selectionBox, setSelectionBox] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

  const { guides, onDragMove, onDragEnd } = useSmartGuides(stageRef, elements, snapEnabled, gridEnabled);
  
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
        ref={stageRef}
        width={width} 
        height={height}
        onMouseDown={(e) => {
          // Deselect when clicking on empty stage area
          const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "bg-rect";
          if (clickedOnEmpty) {
            if (!e.evt.shiftKey && !e.evt.ctrlKey && !e.evt.metaKey) {
              setSelectedObjectIds([]);
            }
            const pos = e.target.getStage()?.getPointerPosition();
            if (pos) {
              setSelectionBox({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
            }
          }
        }}
        onMouseMove={(e) => {
          if (!selectionBox) return;
          const pos = e.target.getStage()?.getPointerPosition();
          if (pos) {
            setSelectionBox(prev => prev ? { ...prev, x2: pos.x, y2: pos.y } : null);
          }
        }}
        onMouseUp={(e) => {
          if (selectionBox) {
            // Calculate intersections
            const box = {
              x: Math.min(selectionBox.x1, selectionBox.x2),
              y: Math.min(selectionBox.y1, selectionBox.y2),
              width: Math.abs(selectionBox.x1 - selectionBox.x2),
              height: Math.abs(selectionBox.y1 - selectionBox.y2)
            };
            
            if (box.width > 2 && box.height > 2) {
              const shapes = stageRef.current?.find('.element-group') || [];
              const selectedIds: string[] = [];
              
              shapes.forEach(shape => {
                const shapeBox = shape.getClientRect();
                if (
                  Konva.Util.haveIntersection(box, shapeBox)
                ) {
                  selectedIds.push(shape.id());
                }
              });

              if (selectedIds.length > 0) {
                if (e.evt.shiftKey) {
                  const currentSelections = useEditorStore.getState().selectedObjectIds;
                  setSelectedObjectIds(Array.from(new Set([...currentSelections, ...selectedIds])));
                } else {
                  setSelectedObjectIds(selectedIds);
                }
              }
            }
            setSelectionBox(null);
          }
        }}
        onTap={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "bg-rect";
          if (clickedOnEmpty) {
            setSelectedObjectIds([]);
          }
        }}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
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
            onSelect={() => {}} 
          />

          {/* Selection Box */}
          {selectionBox && (
            <Rect
              x={Math.min(selectionBox.x1, selectionBox.x2)}
              y={Math.min(selectionBox.y1, selectionBox.y2)}
              width={Math.abs(selectionBox.x1 - selectionBox.x2)}
              height={Math.abs(selectionBox.y1 - selectionBox.y2)}
              fill="rgba(0, 161, 255, 0.3)"
              stroke="rgba(0, 161, 255, 0.8)"
              strokeWidth={1}
            />
          )}

          {/* Selection Transformer */}
          <TransformerNode stageRef={stageRef} />
        </Layer>
        
        {/* Guides Layer (Always on top) */}
        {guides.length > 0 && (
          <Layer>
            {guides.map((guide) => (
              <Line
                key={guide.id}
                points={[guide.x1, guide.y1, guide.x2, guide.y2]}
                stroke="#00a1ff"
                strokeWidth={1}
                dash={[4, 4]}
              />
            ))}
          </Layer>
        )}
      </Stage>
    </div>
  );
}
