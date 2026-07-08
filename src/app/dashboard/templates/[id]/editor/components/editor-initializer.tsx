"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/features/template-editor/store/editor-store";

export function EditorInitializer({ template }: { template: any }) {
  const initialized = useRef(false);
  const { setCurrentTemplateId, setCurrentVersionId, setElements, setCanvasPosition, setZoomLevel, setDirtyState } = useEditorStore();

  useEffect(() => {
    if (!initialized.current && template) {
      setCurrentTemplateId(template.id);
      
      if (template.currentVersion) {
        setCurrentVersionId(template.currentVersion.id);
        const jsonData = template.currentVersion.jsonData || {};
        
        if (jsonData.elements) {
          setElements(jsonData.elements);
        }
        
        if (jsonData.canvasPosition) {
          setCanvasPosition(jsonData.canvasPosition);
        }
        
        if (jsonData.zoomLevel) {
          setZoomLevel(jsonData.zoomLevel);
        }
      }
      
      // Reset dirty state to clean after loading
      setTimeout(() => {
        setDirtyState("CLEAN");
      }, 100);
      
      initialized.current = true;
    }
  }, [template, setCurrentTemplateId, setCurrentVersionId, setElements, setCanvasPosition, setZoomLevel, setDirtyState]);

  return null;
}
