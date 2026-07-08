import { create } from "zustand";

import { EditorElement } from "../types/element-types";

export type SidebarTab = "templates" | "elements" | "uploads" | "text" | "images" | "shapes" | "icons" | "qr" | "barcode" | "layers" | "history";

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
  
  // Selections & Elements
  selectedObjectId: string | null;
  elements: EditorElement[];
  clipboard: EditorElement | null;

  // Actions
  setZoomLevel: (zoom: number) => void;
  setCanvasPosition: (pos: { x: number; y: number }) => void;
  setActiveSidebarTab: (tab: SidebarTab | null) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setGridEnabled: (enabled: boolean) => void;
  setRulerEnabled: (enabled: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSelectedObjectId: (id: string | null) => void;
  
  // Element Actions
  addElement: (element: EditorElement) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  setElements: (elements: EditorElement[]) => void;
  
  // Clipboard
  copyElement: (id: string) => void;
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
  gridEnabled: true,
  rulerEnabled: true,
  snapEnabled: true,
  selectedObjectId: null,
  elements: [],
  clipboard: null,

  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setCanvasPosition: (pos) => set({ canvasPosition: pos }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setRulerEnabled: (enabled) => set({ rulerEnabled: enabled }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  
  // Element Actions
  addElement: (element) => set((state) => {
    // New elements go to the top (highest layerIndex logic can be applied if needed, but we rely on array order for z-index in konva)
    return { elements: [...state.elements, element], selectedObjectId: element.id };
  }),
  
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...updates, updatedAt: Date.now() } as EditorElement : el)
  })),
  
  deleteElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id),
    selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
  })),
  
  duplicateElement: (id) => set((state) => {
    const el = state.elements.find(e => e.id === id);
    if (!el) return state;
    
    const newId = crypto.randomUUID();
    const duplicated: EditorElement = {
      ...el,
      id: newId,
      name: `${el.name} (Copy)`,
      x: el.x + 20,
      y: el.y + 20,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    return {
      elements: [...state.elements, duplicated],
      selectedObjectId: newId
    };
  }),
  
  setElements: (elements) => set({ elements }),
  
  // Clipboard
  copyElement: (id) => set((state) => {
    const el = state.elements.find(e => e.id === id);
    return el ? { clipboard: JSON.parse(JSON.stringify(el)) } : state;
  }),
  
  pasteElement: () => set((state) => {
    if (!state.clipboard) return state;
    
    const newId = crypto.randomUUID();
    const pasted: EditorElement = {
      ...state.clipboard,
      id: newId,
      name: `${state.clipboard.name} (Pasted)`,
      x: state.clipboard.x + 20,
      y: state.clipboard.y + 20,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    return {
      elements: [...state.elements, pasted],
      selectedObjectId: newId,
      clipboard: pasted // Update clipboard so repeated pastes keep offsetting
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
    
    return { elements: newElements };
  }),
  
  sendBackward: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx <= 0) return state;
    
    const newElements = [...state.elements];
    const temp = newElements[idx - 1];
    newElements[idx - 1] = newElements[idx];
    newElements[idx] = temp;
    
    return { elements: newElements };
  }),
  
  bringToFront: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx < 0 || idx === state.elements.length - 1) return state;
    
    const newElements = [...state.elements];
    const [el] = newElements.splice(idx, 1);
    newElements.push(el);
    
    return { elements: newElements };
  }),
  
  sendToBack: (id) => set((state) => {
    const idx = state.elements.findIndex(el => el.id === id);
    if (idx <= 0) return state;
    
    const newElements = [...state.elements];
    const [el] = newElements.splice(idx, 1);
    newElements.unshift(el);
    
    return { elements: newElements };
  }),

  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 0.1, 5.0) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 0.1, 0.1) })),
}));
