import { create } from "zustand";

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
  
  // Selections
  selectedObjectId: string | null;

  // Actions
  setZoomLevel: (zoom: number) => void;
  setCanvasPosition: (pos: { x: number; y: number }) => void;
  setActiveSidebarTab: (tab: SidebarTab | null) => void;
  setRightPanelOpen: (isOpen: boolean) => void;
  setGridEnabled: (enabled: boolean) => void;
  setRulerEnabled: (enabled: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSelectedObjectId: (id: string | null) => void;
  
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

  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setCanvasPosition: (pos) => set({ canvasPosition: pos }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
  setRightPanelOpen: (isOpen) => set({ rightPanelOpen: isOpen }),
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setRulerEnabled: (enabled) => set({ rulerEnabled: enabled }),
  setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  
  zoomIn: () => set((state) => ({ zoomLevel: Math.min(state.zoomLevel + 0.1, 5.0) })),
  zoomOut: () => set((state) => ({ zoomLevel: Math.max(state.zoomLevel - 0.1, 0.1) })),
}));
