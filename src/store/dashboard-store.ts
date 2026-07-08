import { create } from "zustand";

interface DashboardState {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
}));
