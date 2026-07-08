import { create } from 'zustand';

export type PrintStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type PrintLayoutType = 'SINGLE_PVC' | 'A4_PORTRAIT' | 'A4_LANDSCAPE';
export type DuplexMode = 'FRONT_ONLY' | 'BACK_ONLY' | 'FRONT_BACK';

export interface PrintFilters {
  schoolId: string;
  templateId: string | null;
  className: string;
  section: string;
}

export interface LayoutSettings {
  layout: PrintLayoutType;
  margin: number;       // mm
  gapX: number;         // mm
  gapY: number;         // mm
  cropMarks: boolean;
  bleed: number;        // mm
}

export interface PrintSettings {
  paperSize: 'A4' | 'A3' | 'LETTER' | 'LEGAL' | 'CUSTOM';
  dpi: 72 | 150 | 300 | 600;
  copies: number;
  duplex: DuplexMode;
}

export interface PrintProgress {
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalCards: number;
  processedCards: number;
  percentage: number;
  message?: string;
}

interface PrintStore {
  currentStep: PrintStep;
  filters: PrintFilters;
  selectedCards: any[]; // The GeneratedCard objects with frontImage/backImage URLs
  layoutSettings: LayoutSettings;
  printSettings: PrintSettings;
  progress: PrintProgress;
  jobId: string | null;

  // Actions
  setStep: (step: PrintStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setFilters: (filters: Partial<PrintFilters>) => void;
  setSelectedCards: (cards: any[]) => void;
  setLayoutSettings: (settings: Partial<LayoutSettings>) => void;
  setPrintSettings: (settings: Partial<PrintSettings>) => void;
  
  updateProgress: (progress: Partial<PrintProgress>) => void;
  setJobId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as PrintStep,
  filters: {
    schoolId: '',
    templateId: null,
    className: '',
    section: '',
  },
  selectedCards: [],
  layoutSettings: {
    layout: 'A4_PORTRAIT' as PrintLayoutType,
    margin: 10,
    gapX: 5,
    gapY: 5,
    cropMarks: true,
    bleed: 0,
  },
  printSettings: {
    paperSize: 'A4' as const,
    dpi: 300 as const,
    copies: 1,
    duplex: 'FRONT_BACK' as DuplexMode,
  },
  progress: {
    status: 'IDLE' as const,
    totalCards: 0,
    processedCards: 0,
    percentage: 0,
  },
  jobId: null,
};

export const usePrintStore = create<PrintStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) as PrintStep })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as PrintStep })),
  
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  setSelectedCards: (cards) => set({ selectedCards: cards }),
  
  setLayoutSettings: (settings) => set((state) => ({ 
    layoutSettings: { ...state.layoutSettings, ...settings } 
  })),
  
  setPrintSettings: (settings) => set((state) => ({ 
    printSettings: { ...state.printSettings, ...settings } 
  })),
  
  updateProgress: (progress) => set((state) => ({
    progress: { ...state.progress, ...progress }
  })),

  setJobId: (id) => set({ jobId: id }),

  reset: () => set(initialState),
}));
