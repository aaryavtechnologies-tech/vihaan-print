import { useEffect } from "react";
import { useEditorStore } from "../store/editor-store";

export function useEditorShortcuts() {
  const { 
    selectedObjectId, 
    deleteElement, 
    copyElement, 
    pasteElement, 
    duplicateElement 
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Delete
      if ((e.key === "Delete" || e.key === "Backspace") && selectedObjectId) {
        e.preventDefault();
        deleteElement(selectedObjectId);
      }

      // Copy: Ctrl+C / Cmd+C
      if (e.key === "c" && (e.ctrlKey || e.metaKey) && selectedObjectId) {
        e.preventDefault();
        copyElement(selectedObjectId);
      }

      // Paste: Ctrl+V / Cmd+V
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        pasteElement();
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedObjectId) {
        e.preventDefault();
        duplicateElement(selectedObjectId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObjectId, deleteElement, copyElement, pasteElement, duplicateElement]);
}
