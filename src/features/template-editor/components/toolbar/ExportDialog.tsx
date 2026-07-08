"use client";

import { usePrintStore, MOCK_STUDENTS } from "../../store/print-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToPDF, exportToZIP, downloadSingleImage } from "../../utils/export-utils";
import { Loader2, Download, Printer, FileArchive, CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function ExportDialog() {
  const { isExportPanelOpen, setExportPanelOpen, settings, updateSettings, queue, addToQueue, clearQueue } = usePrintStore();
  
  const pendingCount = queue.filter(q => q.status === "IDLE" || q.status === "GENERATING").length;
  const completedCount = queue.filter(q => q.status === "COMPLETED").length;
  const failedCount = queue.filter(q => q.status === "FAILED").length;
  const totalCount = queue.length;
  const isGenerating = pendingCount > 0;

  const handleStartGeneration = () => {
    clearQueue();
    addToQueue(MOCK_STUDENTS); // In real app, you would pass selected students
  };

  const handleDownload = () => {
    if (settings.format === "pdf_single" || settings.format === "pdf_a4") {
      exportToPDF(queue, settings, "VIHAAN_ID_Cards.pdf");
    } else if (settings.format === "zip") {
      exportToZIP(queue, MOCK_STUDENTS, "VIHAAN_ID_Cards.zip");
    } else if (settings.format === "png") {
      // Just download the first completed one for testing
      const first = queue.find(q => q.status === "COMPLETED");
      if (first && first.dataUrl) {
        downloadSingleImage(first.dataUrl, `Card_${first.studentId}.png`);
      }
    }
  };

  return (
    <Dialog open={isExportPanelOpen} onOpenChange={setExportPanelOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export & Print ID Cards</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* Settings Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select 
                  value={settings.format} 
                  onValueChange={(val: any) => updateSettings({ format: val })}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf_single">PDF (1 Card / Page)</SelectItem>
                    <SelectItem value="pdf_a4">PDF (A4 Sheet)</SelectItem>
                    <SelectItem value="zip">ZIP (PNGs)</SelectItem>
                    <SelectItem value="png">Single PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality (DPI)</Label>
                <Select 
                  value={settings.dpi.toString()} 
                  onValueChange={(val) => updateSettings({ dpi: parseInt(val || "300") as any })}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select DPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI (Web)</SelectItem>
                    <SelectItem value="150">150 DPI (Draft)</SelectItem>
                    <SelectItem value="300">300 DPI (Print)</SelectItem>
                    <SelectItem value="600">600 DPI (High Res)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {settings.format === "pdf_a4" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select 
                    value={settings.orientation} 
                    onValueChange={(val: any) => updateSettings({ orientation: val })}
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Cards per Page</Label>
                  <Select 
                    value={settings.cardsPerPage.toString()} 
                    onValueChange={(val) => updateSettings({ cardsPerPage: parseInt(val || "10") })}
                    disabled={isGenerating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cards/Page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Cards</SelectItem>
                      <SelectItem value="4">4 Cards</SelectItem>
                      <SelectItem value="8">8 Cards</SelectItem>
                      <SelectItem value="10">10 Cards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="crop-marks" 
                checked={settings.includeCropMarks} 
                onCheckedChange={(c) => updateSettings({ includeCropMarks: !!c })} 
                disabled={isGenerating || settings.format !== "pdf_a4"}
              />
              <Label htmlFor="crop-marks" className="text-sm font-normal">Include Crop Marks</Label>
            </div>
          </div>

          {/* Progress / Status Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border space-y-3">
            <h4 className="text-sm font-semibold mb-2">Print Queue Status</h4>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total Cards:</span>
              <span className="font-medium">{totalCount === 0 ? "Not Started" : totalCount}</span>
            </div>
            
            {totalCount > 0 && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Completed:</span>
                  <span className="font-medium text-emerald-600 flex items-center">
                    {completedCount} <CheckCircle2 className="w-3 h-3 ml-1" />
                  </span>
                </div>
                
                {failedCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Failed:</span>
                    <span className="font-medium text-red-600 flex items-center">
                      {failedCount} <AlertCircle className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                )}
                
                {isGenerating && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Processing:</span>
                    <span className="font-medium text-blue-600 flex items-center">
                      {pendingCount} <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                    </span>
                  </div>
                )}
                
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setExportPanelOpen(false)}>
            Close
          </Button>
          
          {totalCount === 0 || (!isGenerating && totalCount === completedCount + failedCount && completedCount === 0) ? (
            <Button onClick={handleStartGeneration} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Printer className="w-4 h-4 mr-2" />
              Generate All
            </Button>
          ) : isGenerating ? (
            <Button disabled className="bg-blue-600 opacity-70">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Rendering...
            </Button>
          ) : (
            <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {settings.format === "zip" ? <FileArchive className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Download {settings.format.toUpperCase()}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
