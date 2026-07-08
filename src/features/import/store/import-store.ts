import { create } from 'zustand';

export type ImportStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SetupContext {
  schoolId: string;
  templateId?: string;
  academicYear?: string;
  className?: string;
  section?: string;
}

export interface MappedColumn {
  dbField: string;
  fileHeader: string | null;
}

export interface ValidationReport {
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  skippedRows: number;
  rows: any[]; // The actual data with status
}

interface ImportStore {
  currentStep: ImportStep;
  setupContext: SetupContext | null;
  rawFile: File | null;
  parsedData: any[] | null;
  fileHeaders: string[];
  mappedColumns: MappedColumn[];
  validationReport: ValidationReport | null;
  photoMap: Record<string, File>;
  importProgress: {
    percentage: number;
    current: number;
    total: number;
    status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  };
  jobId: string | null;

  // Actions
  setStep: (step: ImportStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSetupContext: (context: SetupContext) => void;
  setFileData: (file: File, headers: string[], data: any[]) => void;
  setMappedColumns: (columns: MappedColumn[]) => void;
  setValidationReport: (report: ValidationReport) => void;
  addPhotos: (photos: Record<string, File>) => void;
  updateProgress: (progress: Partial<ImportStore['importProgress']>) => void;
  setJobId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as ImportStep,
  setupContext: null,
  rawFile: null,
  parsedData: null,
  fileHeaders: [],
  mappedColumns: [],
  validationReport: null,
  photoMap: {},
  importProgress: {
    percentage: 0,
    current: 0,
    total: 0,
    status: 'IDLE' as const,
  },
  jobId: null,
};

export const useImportStore = create<ImportStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 8) as ImportStep })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as ImportStep })),
  
  setSetupContext: (context) => set({ setupContext: context }),
  
  setFileData: (file, headers, data) => set({ 
    rawFile: file, 
    fileHeaders: headers, 
    parsedData: data 
  }),
  
  setMappedColumns: (columns) => set({ mappedColumns: columns }),
  
  setValidationReport: (report) => set({ validationReport: report }),
  
  addPhotos: (photos) => set((state) => ({ 
    photoMap: { ...state.photoMap, ...photos } 
  })),
  
  updateProgress: (progress) => set((state) => ({
    importProgress: { ...state.importProgress, ...progress }
  })),

  setJobId: (id) => set({ jobId: id }),

  reset: () => set(initialState),
}));
