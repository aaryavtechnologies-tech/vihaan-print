import { create } from "zustand";

interface SchoolFilterState {
  searchQuery: string;
  statusFilter: string;
  boardFilter: string;
  cityFilter: string;
  
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setBoardFilter: (board: string) => void;
  setCityFilter: (city: string) => void;
  resetFilters: () => void;
}

export const useSchoolFilters = create<SchoolFilterState>((set) => ({
  searchQuery: "",
  statusFilter: "ALL",
  boardFilter: "ALL",
  cityFilter: "ALL",
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setBoardFilter: (board) => set({ boardFilter: board }),
  setCityFilter: (city) => set({ cityFilter: city }),
  resetFilters: () => set({
    searchQuery: "",
    statusFilter: "ALL",
    boardFilter: "ALL",
    cityFilter: "ALL",
  }),
}));

interface SchoolTableState {
  selectedRowIds: string[];
  toggleRow: (id: string) => void;
  toggleAll: (ids: string[], isSelected: boolean) => void;
  clearSelection: () => void;
}

export const useSchoolTableStore = create<SchoolTableState>((set) => ({
  selectedRowIds: [],
  toggleRow: (id) => set((state) => ({
    selectedRowIds: state.selectedRowIds.includes(id)
      ? state.selectedRowIds.filter((rowId) => rowId !== id)
      : [...state.selectedRowIds, id]
  })),
  toggleAll: (ids, isSelected) => set({
    selectedRowIds: isSelected ? ids : []
  }),
  clearSelection: () => set({ selectedRowIds: [] }),
}));
