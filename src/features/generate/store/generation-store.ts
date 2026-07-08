import { create } from 'zustand';

export type GenerationStep = 1 | 2 | 3 | 4 | 5;

export interface GenerationFilters {
  schoolId: string;
  academicYear: string;
  className: string;
  section: string;
}

export interface GenerationProgress {
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  total: number;
  current: number;
  success: number;
  failed: number;
}

interface GenerationStore {
  currentStep: GenerationStep;
  filters: GenerationFilters;
  templateId: string | null;
  selectedStudentIds: string[] | 'ALL';
  studentsData: any[]; // The actual data of selected students to render
  progress: GenerationProgress;
  jobId: string | null;

  // Actions
  setStep: (step: GenerationStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setFilters: (filters: Partial<GenerationFilters>) => void;
  setTemplateId: (id: string) => void;
  setSelectedStudents: (ids: string[] | 'ALL', data: any[]) => void;
  updateProgress: (progress: Partial<GenerationProgress>) => void;
  setJobId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as GenerationStep,
  filters: {
    schoolId: '',
    academicYear: '',
    className: '',
    section: '',
  },
  templateId: null,
  selectedStudentIds: [],
  studentsData: [],
  progress: {
    status: 'IDLE' as const,
    total: 0,
    current: 0,
    success: 0,
    failed: 0,
  },
  jobId: null,
};

export const useGenerationStore = create<GenerationStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) as GenerationStep })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as GenerationStep })),
  
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  setTemplateId: (id) => set({ templateId: id }),
  
  setSelectedStudents: (ids, data) => set({ 
    selectedStudentIds: ids,
    studentsData: data
  }),
  
  updateProgress: (progress) => set((state) => ({
    progress: { ...state.progress, ...progress }
  })),

  setJobId: (id) => set({ jobId: id }),

  reset: () => set(initialState),
}));
