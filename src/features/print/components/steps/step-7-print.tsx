"use client";

import { useEffect, useState, useRef } from "react";
import { usePrintStore } from "../../store/print-store";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Download, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { generatePDF } from "../../utils/pdf-engine";
import { generateA4Images } from "../../utils/a4-image-engine";
import { createPrintJobRecord } from "../../actions/print-actions";
import { authClient } from "@/lib/auth-client"; // Use client session for user id
import JSZip from "jszip";
import { toast } from "sonner";

export function Step7Print() {
  const router = useRouter();
  const { 
    filters, selectedCards, layoutSettings, printSettings,
    progress, updateProgress, reset 
  } = usePrintStore();
  
  const [isStarted, setIsStarted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isZippingImages, setIsZippingImages] = useState(false);
  const [isGeneratingA4, setIsGeneratingA4] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isStarted && selectedCards.length > 0 && !hasInitialized.current) {
      startCompilation();
    }
  }, [selectedCards]);

  const startCompilation = async () => {
    hasInitialized.current = true;
    setIsStarted(true);
    updateProgress({ status: 'PROCESSING', percentage: 0, message: 'Initializing PDF Engine...' });

    try {
      // 1. Get current user session
      const { data: session } = await authClient.getSession();
      if (!session?.user?.id) throw new Error("Unauthorized");

      // 2. We need the template dimensions. Get from the first card's template relation.
      const template = selectedCards[0]?.template;
      if (!template) throw new Error("Template data missing");

      // 3. Generate PDFs in chunks of 20 to prevent browser memory crashes
      updateProgress({ message: 'Compiling high-resolution PDFs... This may take a minute.' });
      
      const chunkSize = 20;
      const chunks: any[][] = [];
      for (let i = 0; i < selectedCards.length; i += chunkSize) {
        chunks.push(selectedCards.slice(i, i + chunkSize));
      }

      const generatedBlobs: Blob[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        updateProgress({ message: `Compiling chunk ${i + 1} of ${chunks.length}...` });
        
        const pdfBlob = await generatePDF({
          cards: chunk,
          template,
          layoutSettings,
          printSettings,
          onProgress: (p:any) => {
            const overallProgress = ((i / chunks.length) * 100) + (p / chunks.length);
            updateProgress({ percentage: Math.round(overallProgress) });
          }
        });
        
        generatedBlobs.push(pdfBlob);
      }

      let finalUrl: string;
      let finalExtension: string;

      if (generatedBlobs.length === 1) {
        // Single PDF
        finalUrl = URL.createObjectURL(generatedBlobs[0]);
        finalExtension = "pdf";
      } else {
        // Multiple chunks, ZIP them
        updateProgress({ message: 'Zipping compiled PDFs...' });
        const zip = new JSZip();
        generatedBlobs.forEach((blob, index) => {
          zip.file(`print_job_part_${index + 1}.pdf`, blob);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        finalUrl = URL.createObjectURL(zipBlob);
        finalExtension = "zip";
      }

      setDownloadUrl(`${finalUrl}#${finalExtension}`); // Hack to pass extension to UI

      // 5. Save Print Job to Database
      updateProgress({ message: 'Recording Print Job...' });
      
      const recordParams = {
        schoolId: filters.schoolId,
        templateId: filters.templateId,
        jobName: `Print Batch - ${new Date().toLocaleDateString()}`,
        layout: layoutSettings.layout,
        paperSize: printSettings.paperSize,
        orientation: layoutSettings.layout === 'A4_LANDSCAPE' ? 'landscape' : 'portrait',
        dpi: printSettings.dpi,
        copies: printSettings.copies,
        totalCards: selectedCards.length * printSettings.copies,
        userId: session.user.id,
        cardIds: selectedCards.map(c => c.id)
      };

      await createPrintJobRecord(recordParams);

      updateProgress({ status: 'COMPLETED', percentage: 100, message: 'Ready for Download' });
      
    } catch (error) {
      console.error(error);
      updateProgress({ status: 'FAILED', message: "A critical error occurred while generating the PDF." });
    }
  };

  const downloadImagesZip = async () => {
    setIsZippingImages(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("id_cards_images");
      
      for (let i = 0; i < selectedCards.length; i++) {
        const card = selectedCards[i];
        const studentIdStr = card.student?.studentId ? card.student.studentId.replace(/[^a-zA-Z0-9]/g, '_') : `card_${i}`;
        
        if (card.frontImage) {
          const res = await fetch(`/api/proxy-download?url=${encodeURIComponent(card.frontImage)}`);
          const blob = await res.blob();
          folder?.file(`${studentIdStr}_front.png`, blob);
        }
        if (card.backImage) {
          const res = await fetch(`/api/proxy-download?url=${encodeURIComponent(card.backImage)}`);
          const blob = await res.blob();
          folder?.file(`${studentIdStr}_back.png`, blob);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `id_cards_images_${new Date().getTime()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Images ZIP downloaded successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download images. Make sure CORS is configured properly.");
    } finally {
      setIsZippingImages(false);
    }
  };

  const downloadA4Images = async () => {
    setIsGeneratingA4(true);
    try {
      const template = selectedCards[0]?.template;
      if (!template) throw new Error("Template data missing");

      const blobs = await generateA4Images({ 
        cards: selectedCards, 
        template
      });

      if (blobs.length === 1) {
        const url = URL.createObjectURL(blobs[0]);
        const link = document.createElement("a");
        link.href = url;
        link.download = `A4_ID_Cards_${new Date().getTime()}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("A4 Image downloaded successfully!");
      } else {
        const zip = new JSZip();
        blobs.forEach((blob, index) => {
          zip.file(`A4_Page_${index + 1}.png`, blob);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `A4_ID_Cards_${new Date().getTime()}.zip`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("A4 Images ZIP downloaded successfully!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate A4 images.");
    } finally {
      setIsGeneratingA4(false);
    }
  };

  const handleFinish = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl.split('#')[0]);
    }
    reset();
    router.push("/dashboard/print/history");
  };

  if (progress.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-bold text-slate-800">Generation Failed</h3>
        <p className="text-slate-500 mt-2">{progress.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-8">Try Again</Button>
      </div>
    );
  }

  if (progress.status === 'COMPLETED' && downloadUrl) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Print Job Ready!</h2>
          <p className="text-slate-500 text-lg">Your high-resolution PDF has been successfully compiled and recorded.</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a href={downloadUrl.split('#')[0]} download={`print_job_${new Date().getTime()}.${downloadUrl.split('#')[1] || 'pdf'}`}>
              <Button 
                className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-bold text-lg w-full sm:w-auto"
              >
                <Download className="w-5 h-5 mr-3" /> Download {downloadUrl.split('#')[1] === 'zip' ? 'ZIP Archive' : 'PDF File'}
              </Button>
            </a>
            
            <Button 
              onClick={downloadImagesZip}
              disabled={isZippingImages || isGeneratingA4}
              variant="outline"
              className="h-14 px-8 rounded-xl bg-white border-slate-200 text-slate-800 shadow-sm transition-all font-bold text-lg w-full sm:w-auto"
            >
              {isZippingImages ? (
                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Zipping...</>
              ) : (
                <><ImageIcon className="w-5 h-5 mr-3 text-blue-600" /> Export Individual (ZIP)</>
              )}
            </Button>
            
            <Button 
              onClick={downloadA4Images}
              disabled={isGeneratingA4 || isZippingImages}
              variant="outline"
              className="h-14 px-8 rounded-xl bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 shadow-sm transition-all font-bold text-lg w-full sm:w-auto"
            >
              {isGeneratingA4 ? (
                <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Generating A4...</>
              ) : (
                <><ImageIcon className="w-5 h-5 mr-3 text-indigo-600" /> Download A4 Image</>
              )}
            </Button>
          </div>
          
          <Button variant="ghost" onClick={handleFinish} className="text-slate-500 hover:text-slate-700 mt-6">
            Return to Print History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Compiling Print Output...</h3>
      <p className="text-slate-500 mb-8">{progress.message || "Please do not close this tab."}</p>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-end text-sm font-medium text-slate-600">
          <span>{progress.percentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
