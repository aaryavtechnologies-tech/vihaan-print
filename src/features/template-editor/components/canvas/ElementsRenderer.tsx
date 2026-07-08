"use client";

import { Text, Rect, Circle } from "react-konva";
import { EditorElement, TextElement, ShapeElement, PlaceholderElement } from "../../types/element-types";
import { CanvasElementWrapper } from "./CanvasElementWrapper";

interface ElementsRendererProps {
  elements: EditorElement[];
  onSelect: (node: any) => void;
}

export function ElementsRenderer({ elements, onSelect }: ElementsRendererProps) {
  return (
    <>
      {elements.map((element) => {
        switch (element.type) {
          case "text": {
            const textEl = element as TextElement;
            return (
              <CanvasElementWrapper key={element.id} element={element} onSelect={onSelect}>
                {textEl.backgroundColor && (
                  <Rect
                    width={textEl.width}
                    height={textEl.height}
                    fill={textEl.backgroundColor}
                  />
                )}
                <Text
                  width={textEl.width}
                  height={textEl.height}
                  text={textEl.text}
                  fill={textEl.textColor}
                  fontSize={textEl.fontSize}
                  fontFamily={textEl.fontFamily}
                  fontStyle={textEl.fontStyle}
                  align={textEl.textAlign}
                  // Let Konva handle line heights correctly
                  lineHeight={textEl.lineHeight}
                  // Basic text wrap setup
                  wrap="word"
                />
              </CanvasElementWrapper>
            );
          }
          
          case "rectangle": {
            const rectEl = element as ShapeElement;
            return (
              <CanvasElementWrapper key={element.id} element={element} onSelect={onSelect}>
                <Rect
                  width={rectEl.width}
                  height={rectEl.height}
                  fill={rectEl.fill || "transparent"}
                  stroke={rectEl.stroke || "transparent"}
                  strokeWidth={rectEl.strokeWidth || 0}
                  cornerRadius={rectEl.cornerRadius || 0}
                />
              </CanvasElementWrapper>
            );
          }
          
          case "circle": {
            const circEl = element as ShapeElement;
            // Konva Circle uses radius, but we map width/height via bounding box for uniform scaling in Transformer
            // The wrapper handles width/height, we just draw an ellipse to match bounds
            return (
              <CanvasElementWrapper key={element.id} element={element} onSelect={onSelect}>
                <Rect
                  width={circEl.width}
                  height={circEl.height}
                  fill={circEl.fill || "transparent"}
                  stroke={circEl.stroke || "transparent"}
                  strokeWidth={circEl.strokeWidth || 0}
                  cornerRadius={Math.max(circEl.width, circEl.height)} // Forces a circle/ellipse appearance inside Rect
                />
              </CanvasElementWrapper>
            );
          }

          case "placeholder": {
            const placeEl = element as PlaceholderElement;
            return (
              <CanvasElementWrapper key={element.id} element={element} onSelect={onSelect}>
                <Rect
                  width={placeEl.width}
                  height={placeEl.height}
                  fill={placeEl.fill || "#e2e8f0"}
                  stroke="#94a3b8"
                  strokeWidth={1}
                  dash={[4, 4]}
                />
                <Text
                  width={placeEl.width}
                  height={placeEl.height}
                  text={placeEl.placeholderText || placeEl.placeholderType}
                  fill={placeEl.textColor || "#64748b"}
                  fontSize={placeEl.fontSize || 12}
                  fontFamily={placeEl.fontFamily || "Arial"}
                  align={placeEl.textAlign || "center"}
                  verticalAlign="middle"
                />
              </CanvasElementWrapper>
            );
          }

          // Other types (image, line, qr, barcode) will be added in Phase 6.3/6.4
          default:
            return null;
        }
      })}
    </>
  );
}
