"use client";

import { useRef, useEffect } from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { useEditorStore } from "../../store/editor-store";
import { EditorElement } from "../../types/element-types";

interface CanvasElementWrapperProps {
  element: EditorElement;
  onSelect: (node: Konva.Node) => void;
  children: React.ReactNode;
}

export function CanvasElementWrapper({ element, onSelect, children }: CanvasElementWrapperProps) {
  const { setSelectedObjectId, selectedObjectId, updateElement } = useEditorStore();
  const groupRef = useRef<Konva.Group>(null);
  
  const isSelected = selectedObjectId === element.id;

  useEffect(() => {
    if (isSelected && groupRef.current) {
      onSelect(groupRef.current);
    }
  }, [isSelected, onSelect]);

  if (!element.visible) return null;

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      draggable={!element.locked}
      opacity={element.opacity ?? 1}
      onClick={(e) => {
        e.cancelBubble = true; // Prevent event bubbling to background (which would deselect)
        setSelectedObjectId(element.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        setSelectedObjectId(element.id);
      }}
      onDragEnd={(e) => {
        updateElement(element.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
    >
      {children}
      {/* Optional: Add a hover highlight border here in the future if desired */}
    </Group>
  );
}
