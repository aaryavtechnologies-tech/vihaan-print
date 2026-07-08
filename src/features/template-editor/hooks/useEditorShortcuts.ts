import { useEffect } from "react";
import { useEditorStore } from "../store/editor-store";

export function useEditorShortcuts() {
  const { 
    selectedObjectIds, 
    deleteElement, 
    copyElement, 
    pasteElement, 
    duplicateElement,
    undo,
    redo,
    updateElements
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
      if ((e.key === "Delete" || e.key === "Backspace") && selectedObjectIds.length > 0) {
        e.preventDefault();
        deleteElement(selectedObjectIds);
      }

      // Copy: Ctrl+C / Cmd+C
      if (e.key === "c" && (e.ctrlKey || e.metaKey) && selectedObjectIds.length > 0) {
        e.preventDefault();
        copyElement(selectedObjectIds);
      }

      // Paste: Ctrl+V / Cmd+V
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        pasteElement();
      }

      // Undo / Redo: Ctrl+Z / Ctrl+Shift+Z / Cmd+Z / Cmd+Shift+Z
      if (e.key.toLowerCase() === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedObjectIds.length > 0) {
        e.preventDefault();
        duplicateElement(selectedObjectIds);
        return;
      }

      // Arrow key nudging
      if (
        (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        selectedObjectIds.length > 0
      ) {
        e.preventDefault();
        const state = useEditorStore.getState();
        const amount = e.shiftKey ? 10 : 1;
        
        const updates: { id: string, changes: Partial<any> }[] = [];
        
        selectedObjectIds.forEach(id => {
          const el = state.elements.find(el => el.id === id);
          if (el && !el.locked) {
            let { x, y } = el;
            if (e.key === "ArrowUp") y -= amount;
            if (e.key === "ArrowDown") y += amount;
            if (e.key === "ArrowLeft") x -= amount;
            if (e.key === "ArrowRight") x += amount;
            
            updates.push({ id, changes: { x, y } });
          }
        });

        if (updates.length > 0) {
          updateElements(updates);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObjectIds, deleteElement, copyElement, pasteElement, duplicateElement, undo, redo, updateElements]);
}
