import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editor-store";
import { saveTemplateDraft } from "../server/template-actions";

export function useAutoSave() {
  const { 
    currentTemplateId, 
    elements, 
    canvasPosition, 
    zoomLevel,
    dirtyState, 
    setDirtyState 
  } = useEditorStore();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // If no template is loaded or there are no unsaved changes, do nothing.
    if (!currentTemplateId || dirtyState !== "UNSAVED") {
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to save after 3 seconds of inactivity
    timeoutRef.current = setTimeout(async () => {
      setDirtyState("SAVING");
      try {
        const jsonData = {
          elements,
          canvasPosition,
          zoomLevel
        };
        
        await saveTemplateDraft(currentTemplateId, jsonData);
        setDirtyState("SAVED");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setDirtyState("ERROR");
      }
    }, 3000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentTemplateId, elements, canvasPosition, zoomLevel, dirtyState, setDirtyState]);
  
  // Warn user before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyState === "UNSAVED" || dirtyState === "SAVING") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirtyState]);
}
