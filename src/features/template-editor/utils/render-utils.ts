import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 512,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
  } catch (err) {
    console.error("QR Code generation error", err);
    return "";
  }
}

export function generateBarcode(text: string, format = "CODE128"): string {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
      format: format,
      displayValue: false,
      margin: 0,
      width: 2,
      height: 100,
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Barcode generation error", err);
    return "";
  }
}

export function replacePlaceholders(text: string, studentData: Record<string, any>): string {
  if (!text) return "";
  
  // Replace brackets like [Student Name] or [student_name]
  let result = text;
  
  // Mapping logic for standard placeholders
  const map: Record<string, string> = {
    "student name": studentData.student_name || "",
    "student_name": studentData.student_name || "",
    "father name": studentData.father_name || "",
    "father_name": studentData.father_name || "",
    "mother name": studentData.mother_name || "",
    "mother_name": studentData.mother_name || "",
    "class": studentData.class || "",
    "section": studentData.section || "",
    "roll number": studentData.roll_number || "",
    "roll_number": studentData.roll_number || "",
    "admission number": studentData.admission_number || "",
    "admission_number": studentData.admission_number || "",
    "dob": studentData.dob || "",
    "blood group": studentData.blood_group || "",
    "blood_group": studentData.blood_group || "",
    "mobile": studentData.mobile || "",
    "address": studentData.address || "",
    "school name": studentData.school_name || "",
    "school_name": studentData.school_name || "",
  };

  // Replace [key] placeholders
  const regex = /\[(.*?)\]/g;
  result = result.replace(regex, (match, key) => {
    const normalizedKey = key.toLowerCase().trim();
    if (map[normalizedKey] !== undefined) {
      return map[normalizedKey];
    }
    // Check if it exists directly in student data
    if (studentData[normalizedKey] !== undefined) {
      return studentData[normalizedKey];
    }
    return match; // Keep placeholder if no data
  });

  return result;
}
