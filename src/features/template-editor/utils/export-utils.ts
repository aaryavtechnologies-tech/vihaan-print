import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { PrintSettings, PrintQueueItem, StudentData } from "../store/print-store";

export const CR80_WIDTH_MM = 85.60;
export const CR80_HEIGHT_MM = 53.98;
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// Utility to convert dataUrl to Blob
function dataURLtoBlob(dataurl: string) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

// Triggers a browser download
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

export function downloadSingleImage(dataUrl: string, filename: string) {
  const blob = dataURLtoBlob(dataUrl);
  downloadBlob(blob, filename);
}

export async function exportToZIP(queue: PrintQueueItem[], students: StudentData[], zipFilename = "ID_Cards.zip") {
  const zip = new JSZip();
  
  queue.forEach(item => {
    if (item.status === "COMPLETED" && item.dataUrl) {
      const student = students.find(s => s.id === item.studentId);
      const name = student ? student.student_name.replace(/[^a-z0-9]/gi, '_') : item.studentId;
      const base64Data = item.dataUrl.split(',')[1];
      zip.file(`${name}_${item.studentId}.png`, base64Data, { base64: true });
    }
  });

  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, zipFilename);
}

export function exportToPDF(queue: PrintQueueItem[], settings: PrintSettings, filename = "ID_Cards.pdf") {
  const completedItems = queue.filter(item => item.status === "COMPLETED" && item.dataUrl);
  if (completedItems.length === 0) return;

  if (settings.format === "pdf_single") {
    // PVC Card (CR80) - each card is its own page
    // Orientation depends on the aspect ratio of the template, typically landscape
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [CR80_HEIGHT_MM, CR80_WIDTH_MM] // [width, height] for landscape usually
    });

    completedItems.forEach((item, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(item.dataUrl!, "PNG", 0, 0, CR80_WIDTH_MM, CR80_HEIGHT_MM);
    });

    pdf.save(filename);
  } 
  else if (settings.format === "pdf_a4") {
    // A4 Sheet - Layout multiple cards per page
    const pdf = new jsPDF({
      orientation: settings.orientation,
      unit: "mm",
      format: "a4"
    });

    const pageWidth = settings.orientation === "portrait" ? A4_WIDTH_MM : A4_HEIGHT_MM;
    const pageHeight = settings.orientation === "portrait" ? A4_HEIGHT_MM : A4_WIDTH_MM;
    
    // Simple Grid Calculation (e.g. 2 columns for portrait)
    const margin = settings.margins;
    const cols = 2; 
    const rows = 5; // e.g. 10 cards per page
    
    // Spacing
    const xSpace = (pageWidth - (2 * margin) - (cols * CR80_WIDTH_MM)) / Math.max(1, cols - 1);
    const ySpace = (pageHeight - (2 * margin) - (rows * CR80_HEIGHT_MM)) / Math.max(1, rows - 1);

    let currentCardOnPage = 0;

    completedItems.forEach((item, index) => {
      if (currentCardOnPage >= settings.cardsPerPage) {
        pdf.addPage();
        currentCardOnPage = 0;
      }

      const row = Math.floor(currentCardOnPage / cols);
      const col = currentCardOnPage % cols;

      const x = margin + (col * (CR80_WIDTH_MM + xSpace));
      const y = margin + (row * (CR80_HEIGHT_MM + ySpace));

      pdf.addImage(item.dataUrl!, "PNG", x, y, CR80_WIDTH_MM, CR80_HEIGHT_MM);

      if (settings.includeCropMarks) {
        // Draw crop marks (basic)
        pdf.setLineWidth(0.2);
        // Top Left
        pdf.line(x - 2, y, x - 5, y);
        pdf.line(x, y - 2, x, y - 5);
        // Top Right
        pdf.line(x + CR80_WIDTH_MM + 2, y, x + CR80_WIDTH_MM + 5, y);
        pdf.line(x + CR80_WIDTH_MM, y - 2, x + CR80_WIDTH_MM, y - 5);
        // Bottom Left
        pdf.line(x - 2, y + CR80_HEIGHT_MM, x - 5, y + CR80_HEIGHT_MM);
        pdf.line(x, y + CR80_HEIGHT_MM + 2, x, y + CR80_HEIGHT_MM + 5);
        // Bottom Right
        pdf.line(x + CR80_WIDTH_MM + 2, y + CR80_HEIGHT_MM, x + CR80_WIDTH_MM + 5, y + CR80_HEIGHT_MM);
        pdf.line(x + CR80_WIDTH_MM, y + CR80_HEIGHT_MM + 2, x + CR80_WIDTH_MM, y + CR80_HEIGHT_MM + 5);
      }

      currentCardOnPage++;
    });

    pdf.save(filename);
  }
}
