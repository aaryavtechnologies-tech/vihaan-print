export type ElementType = 
  | "text" 
  | "image" 
  | "rectangle" 
  | "circle" 
  | "line" 
  | "qr" 
  | "barcode"
  | "placeholder"; // For Photo, Student Name, etc.

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  layerIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold" | "lighter" | "bolder" | number;
  fontStyle: "normal" | "italic";
  textColor: string;
  backgroundColor?: string;
  letterSpacing: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right" | "justify";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  maxWidth?: number;
  autoResize: boolean;
  placeholderText?: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  imageUrl: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  maintainAspectRatio: boolean;
}

export interface ShapeElement extends BaseElement {
  type: "rectangle" | "circle" | "line";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number; // Only for rectangle
  points?: number[]; // Only for line
}

export interface QRElement extends BaseElement {
  type: "qr";
  qrType: "studentId" | "url" | "custom";
  qrValue?: string;
  foregroundColor: string;
  backgroundColor: string;
}

export interface BarcodeElement extends BaseElement {
  type: "barcode";
  barcodeType: "code128" | "ean13" | "upc";
  barcodeValue?: string;
  foregroundColor: string;
  backgroundColor: string;
}

export interface PlaceholderElement extends BaseElement {
  type: "placeholder";
  placeholderType: 
    | "student_photo"
    | "student_name"
    | "father_name"
    | "mother_name"
    | "class"
    | "section"
    | "roll_number"
    | "admission_number"
    | "student_id"
    | "dob"
    | "gender"
    | "blood_group"
    | "mobile"
    | "address"
    | "school_name"
    | "school_logo"
    | "principal_signature";
  // Usually placeholders act as text or image masks depending on type
  placeholderText?: string;
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  fontWeight?: string | number;
  textAlign?: "left" | "center" | "right";
}

export type EditorElement = 
  | TextElement 
  | ImageElement 
  | ShapeElement 
  | QRElement 
  | BarcodeElement 
  | PlaceholderElement;
