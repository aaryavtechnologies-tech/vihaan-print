import { create } from "zustand";

export type PrintFormat = "pdf_single" | "pdf_a4" | "png" | "jpeg" | "zip";

export interface PrintSettings {
  format: PrintFormat;
  dpi: 72 | 150 | 300 | 600;
  orientation: "portrait" | "landscape"; // For A4 sheet
  cardsPerPage: number; // 1, 2, 4, 8, 10 for A4
  margins: number; // In mm
  includeCropMarks: boolean;
  includeBleed: boolean;
  transparentBackground: boolean;
}

export interface StudentData {
  id: string;
  student_id: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  class?: string;
  section?: string;
  roll_number?: string;
  admission_number?: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  mobile?: string;
  address?: string;
  school_name?: string;
  issue_date?: string;
  expiry_date?: string;
  student_photo?: string;
  [key: string]: any; // Allow custom fields
}

export type QueueStatus = "IDLE" | "GENERATING" | "COMPLETED" | "FAILED";

export interface PrintQueueItem {
  id: string;
  studentId: string;
  status: QueueStatus;
  progress: number; // 0 to 100
  dataUrl?: string;
  error?: string;
}

interface PrintState {
  settings: PrintSettings;
  queue: PrintQueueItem[];
  isPreviewOpen: boolean;
  isExportPanelOpen: boolean;
  
  // Actions
  updateSettings: (settings: Partial<PrintSettings>) => void;
  setPreviewOpen: (isOpen: boolean) => void;
  setExportPanelOpen: (isOpen: boolean) => void;
  addToQueue: (students: StudentData[]) => void;
  updateQueueItem: (id: string, updates: Partial<PrintQueueItem>) => void;
  clearQueue: () => void;
  removeQueueItem: (id: string) => void;
}

export const usePrintStore = create<PrintState>((set) => ({
  settings: {
    format: "pdf_single",
    dpi: 300,
    orientation: "portrait",
    cardsPerPage: 10,
    margins: 10,
    includeCropMarks: false,
    includeBleed: false,
    transparentBackground: false,
  },
  queue: [],
  isPreviewOpen: false,
  isExportPanelOpen: false,

  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
  
  setPreviewOpen: (isOpen) => set({ isPreviewOpen: isOpen }),
  setExportPanelOpen: (isOpen) => set({ isExportPanelOpen: isOpen }),
  
  addToQueue: (students) => set((state) => {
    const newItems = students.map(student => ({
      id: crypto.randomUUID(),
      studentId: student.id,
      status: "IDLE" as QueueStatus,
      progress: 0
    }));
    return { queue: [...state.queue, ...newItems] };
  }),
  
  updateQueueItem: (id, updates) => set((state) => ({
    queue: state.queue.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  
  clearQueue: () => set({ queue: [] }),
  removeQueueItem: (id) => set((state) => ({ queue: state.queue.filter(item => item.id !== id) }))
}));

// Mock Data for Testing
export const MOCK_STUDENTS: StudentData[] = [
  {
    id: "s1",
    student_id: "STU2026001",
    student_name: "Aarav Patel",
    father_name: "Rajesh Patel",
    mother_name: "Meera Patel",
    class: "10",
    section: "A",
    roll_number: "01",
    admission_number: "ADM-1001",
    dob: "15/05/2010",
    blood_group: "O+",
    mobile: "+91 9876543210",
    address: "123, Sunrise Enclave, Mumbai",
    school_name: "Vihaan International School",
    issue_date: "01/04/2026",
    expiry_date: "31/03/2027",
    student_photo: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Using demo cloudinary image
  },
  {
    id: "s2",
    student_id: "STU2026002",
    student_name: "Priya Sharma",
    father_name: "Amit Sharma",
    mother_name: "Kavita Sharma",
    class: "10",
    section: "B",
    roll_number: "14",
    admission_number: "ADM-1002",
    dob: "22/08/2010",
    blood_group: "B+",
    mobile: "+91 9876543211",
    address: "45, Green Park, Delhi",
    school_name: "Vihaan International School",
    issue_date: "01/04/2026",
    expiry_date: "31/03/2027",
    student_photo: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  }
];
