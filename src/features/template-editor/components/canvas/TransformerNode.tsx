"use client";

import { useRef, useEffect } from "react";
import { Transformer } from "react-konva";
import { useEditorStore } from "../../store/editor-store";
import Konva from "konva";

interface TransformerNodeProps {
  selectedNode: Konva.Node | null;
}

export function TransformerNode({ selectedNode }: TransformerNodeProps) {
  const trRef = useRef<Konva.Transformer>(null);
  const { elements, selectedObjectId, updateElement } = useEditorStore();
  
  const element = elements.find(e => e.id === selectedObjectId);

  useEffect(() => {
    if (selectedNode && trRef.current && element && !element.locked) {
      // we need to attach transformer manually
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer()?.batchDraw();
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedNode, element?.locked]);

  // If no object is selected or the object is locked, do not render transformer bounds
  if (!selectedObjectId || !element || element.locked) return null;

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize bounds if needed
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
      // Keep aspect ratio for images by default
      keepRatio={element.type === "image" || element.type === "qr" || element.type === "placeholder"}
      onTransformEnd={(e) => {
        // After resize/rotate via transformer
        const node = selectedNode;
        if (!node) return;
        
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale so it's applied directly to width/height
        node.scaleX(1);
        node.scaleY(1);

        updateElement(selectedObjectId, {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        });
      }}
    />
  );
}
