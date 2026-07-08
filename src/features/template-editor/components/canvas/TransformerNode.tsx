"use client";

import { useRef, useEffect } from "react";
import { Transformer } from "react-konva";
import { useEditorStore } from "../../store/editor-store";
import Konva from "konva";

interface TransformerNodeProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function TransformerNode({ stageRef }: TransformerNodeProps) {
  const trRef = useRef<Konva.Transformer>(null);
  const { elements, selectedObjectIds, updateElement } = useEditorStore();
  
  useEffect(() => {
    if (trRef.current && stageRef.current) {
      if (selectedObjectIds.length > 0) {
        // Find all nodes in the stage that match the selected IDs
        const selectedNodes = selectedObjectIds.map(id => stageRef.current?.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];
        
        // Filter out locked elements
        const unlockedNodes = selectedNodes.filter(node => {
          const el = elements.find(e => e.id === node.id());
          return el && !el.locked;
        });

        if (unlockedNodes.length > 0) {
          trRef.current.nodes(unlockedNodes);
        } else {
          trRef.current.nodes([]);
        }
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedObjectIds, elements, stageRef]);

  if (selectedObjectIds.length === 0) return null;

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
      // Optional: hide resize handlers if multiple items selected? Or allow multi-resize?
      // Canva allows multi-resize, so let's keep it.
      onTransformEnd={(e) => {
        // When multiple items are transformed, we have to update all of them
        const nodes = trRef.current?.nodes() || [];
        nodes.forEach(node => {
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          node.scaleX(1);
          node.scaleY(1);
          
          updateElement(node.id(), {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        });
      }}
    />
  );
}
