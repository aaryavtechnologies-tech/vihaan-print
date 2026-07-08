import { create } from "zustand";

import { EditorElement } from "../types/element-types";

export type SidebarTab = "templates" | "elements" | "uploads" | "text" | "images" | "shapes" | "icons" | "qr" | "barcode" | "layers" | "history";
export type DirtyState = "CLEAN" | "UNSAVED" | "SAVING" | "SAVED" | "ERROR";

interface EditorState {
  // Canvas State
  zoomLevel: number;
  canvasPosition: { x: number; y: number };
  
  // Workspace UI
  activeSidebarTab: SidebarTab | null;
  rightPanelOpen: boolean;
  
  // Canvas Configuration
  gridEnabled: boolean;
  rulerEnabled: boolean;
  snapEnabled: boolean;
  
  // History
  past: EditorElement[][];
  future: EditorElement[][];
  
  // Selections & Elements
  selectedObjectIds: string[];
  elements: EditorElement[];
  clipboard: EditorElement[] | null;

  // Persistence
  currentTemplateId: string | null;
  currentVersionId: string | null;
  dirtyState: DirtyState;
  
  // Actions
  setCurrentTemplateId: (id: string | null) => void;
  setCurrentVersionId: (id: string | null) => void;
  setDirtyState: (state: DirtyState) => void;
  setZoomLevel: (zoom: number) => void;
  setCanvasPosition: (pos: { x: number; y: number }) => void;
  setActiveSidebarTab: (tab: SidebarTab | null) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setGridEnabled: (enabled: boolean) => void;
  setRulerEnabled: (enabled: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSelectedObjectIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  
  // Element Actions
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  updateElements: (updates: {id: string, changes: Partial<EditorElement>}[]) => void;
  deleteElement: (ids: string | string[]) => void;
  duplicateElement: (ids: string | string[]) => void;
  setElements: (elements: EditorElement[]) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  saveHistorySnapshot: () => void;
  
  // Clipboard
  copyElement: (ids: string | string[]) => void;
  pasteElement: () => void;

  // Z-Index Controls
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // Zoom Helpers
  zoomIn: () => void;
  zoomOut: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  // Default values
  zoomLevel: 1.0,
  canvasPosition: { x: 0, y: 0 },
  activeSidebarTab: "templates",
  rightPanelOpen: true,
  gridEnabled: false,
  rulerEnabled: true,
  snapEnabled: true,
  selectedObjectIds: [],
  elements: [],
  clipboard: null,
  past: [],
  future: [],
  currentTemplateId: null,
  currentVersionId: null,
  dirtyState: "CLEAN",

  setCurrentTemplateId: (id) => set({ currentTemplateId: id }),
  setCurrentVersionId: (id) => set({ currentVersionId: id }),
  setDirtyState: (state) => set({ dirtyState: state }),

  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setCanvasPosition: (pos) => set({ canvasPosition: pos, dirtyState: "UNSAVED" }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setRulerEnabled: (enabled) => set({ rulerEnabled: enabled }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSelectedObjectIds: (ids) => set({ selectedObjectIds: ids }),
  toggleSelection: (id) => set((state) => ({
    selectedObjectIds: state.selectedObjectIds.includes(id) 
      ? state.selectedObjectIds.filter(selId => selId !== id)
      : [...state.selectedObjectIds, id]
  })),
  
  // Element Actions
  addElement: (element) => set((state) => {
    return { 
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: [...state.elements, element], 
      selectedObjectIds: [element.id],
      dirtyState: "UNSAVED"
    };
  }),
  
  updateElement: (id, updates) => set((state) => {
    return {
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: state.elements.map(el => el.id === id ? { ...el, ...updates, updatedAt: Date.now() } as EditorElement : el),
      dirtyState: "UNSAVED"
    };
  }),

  updateElements: (updates) => set((state) => {
    return {
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: state.elements.map(el => {
        const update = updates.find(u => u.id === el.id);
        if (update) {
          return { ...el, ...update.changes, updatedAt: Date.now() } as EditorElement;
        }
        return el;
      }),
      dirtyState: "UNSAVED"
    };
  }),
  
  deleteElement: (idOrIds) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    return {
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: state.elements.filter(el => !ids.includes(el.id)),
      selectedObjectIds: state.selectedObjectIds.filter(selId => !ids.includes(selId)),
      dirtyState: "UNSAVED"
    };
  }),
  
  duplicateElement: (idOrIds) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const elsToDuplicate = state.elements.filter(e => ids.includes(e.id));
    if (elsToDuplicate.length === 0) return state;
    
    const duplicatedElements = elsToDuplicate.map(el => {
      const newId = crypto.randomUUID();
      return {
        ...el,
        id: newId,
        name: `${el.name} (Copy)`,
        x: el.x + 20,
        y: el.y + 20,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as EditorElement;
    });
    
    return {
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: [...state.elements, ...duplicatedElements],
      selectedObjectIds: duplicatedElements.map(e => e.id),
      dirtyState: "UNSAVED"
    };
  }),
  
  setElements: (elements) => set({ elements }),
  
  // History Actions
  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      past: newPast,
      future: [state.elements, ...state.future],
      elements: previous,
      selectedObjectIds: [],
      dirtyState: "UNSAVED"
    };
  }),
  
  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, state.elements],
      future: newFuture,
      elements: next,
      selectedObjectIds: [],
      dirtyState: "UNSAVED"
    };
  }),
  
  saveHistorySnapshot: () => set((state) => ({
    past: [...state.past, state.elements].slice(-100),
    future: []
  })),
  
  // Clipboard
  copyElement: (idOrIds) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const elsToCopy = state.elements.filter(e => ids.includes(e.id));
    return elsToCopy.length > 0 ? { clipboard: JSON.parse(JSON.stringify(elsToCopy)) } : state;
  }),
  
  pasteElement: () => set((state) => {
    if (!state.clipboard || state.clipboard.length === 0) return state;
    
    const pastedElements = state.clipboard.map(clipEl => {
      const newId = crypto.randomUUID();
      return {
        ...clipEl,
        id: newId,
        name: `${clipEl.name} (Pasted)`,
        x: clipEl.x + 20,
        y: clipEl.y + 20,
        createdAt: Date.now(),
        updatedAt: Date.now()
      } as EditorElement;
    });
    
    return {
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: [...state.elements, ...pastedElements],
      selectedObjectIds: pastedElements.map(e => e.id),
      clipboard: pastedElements,
      dirtyState: "UNSAVED"
    };
  }),

  // Z-Index Controls
  bringForward: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx < 0 || idx === state.elements.length - 1) return state;
    
    const newElements = [...state.elements];
    const temp = newElements[idx + 1];
    newElements[idx + 1] = newElements[idx];
    newElements[idx] = temp;
    
    return { 
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: newElements,
      dirtyState: "UNSAVED"
    };
  }),
  
  sendBackward: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx <= 0) return state;
    
    const newElements = [...state.elements];
    const temp = newElements[idx - 1];
    newElements[idx - 1] = newElements[idx];
    newElements[idx] = temp;
    
    return { 
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: newElements,
      dirtyState: "UNSAVED"
    };
  }),
  
  bringToFront: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx < 0 || idx === state.elements.length - 1) return state;
    
    const newElements = [...state.elements];
    const [el] = newElements.splice(idx, 1);
    newElements.push(el);
    
    return { 
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: newElements,
      dirtyState: "UNSAVED"
    };
  }),
  
  sendToBack: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx <= 0) return state;
    
    const newElements = [...state.elements];
    const [el] = newElements.splice(idx, 1);
    newElements.unshift(el);
    
    return { 
      past: [...state.past, state.elements].slice(-100),
      future: [],
      elements: newElements,
      dirtyState: "UNSAVED"
    };
  }),

  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 0.1, 5.0) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 0.1, 0.1) })),
}));
