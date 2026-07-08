"use client";

import { usePrintStore } from "../../store/print-store";
import { Button } from "@/components/ui/button";

export function Step6Preview() {
  const { layoutSettings, printSettings, selectedCards, nextStep, prevStep } = usePrintStore();

  const { layout, margin, gapX, gapY } = layoutSettings;
  const { paperSize, copies } = printSettings;

  // Rough dimensions for preview box mapping
  const paperDimensions: Record<string, [number, number]> = {
    A4: [210, 297],
    A3: [297, 420],
    LETTER: [215.9, 279.4],
    LEGAL: [215.9, 355.6],
    CUSTOM: [210, 297]
  };

  const isLandscapeLayout = layout === 'A4_LANDSCAPE';
  const paperW = isLandscapeLayout ? paperDimensions[paperSize][1] : paperDimensions[paperSize][0];
  const paperH = isLandscapeLayout ? paperDimensions[paperSize][0] : paperDimensions[paperSize][1];

  // We assume standard CR80 portrait for the visual boxes 54x86
  const cardW = 54; 
  const cardH = 86;

  const usableW = paperW - (margin * 2);
  const usableH = paperH - (margin * 2);
  
  const cols = Math.floor((usableW + gapX) / (cardW + gapX)) || 1;
  const rows = Math.floor((usableH + gapY) / (cardH + gapY)) || 1;
  
  const cardsPerPage = layout === 'SINGLE_PVC' ? 1 : (cols * rows);
  const totalCardsToPrint = selectedCards.length * copies;
  const totalPages = Math.ceil(totalCardsToPrint / cardsPerPage);

  // Calculate preview scale
  // We want the preview paper to fit nicely in a 400px high box
  const previewH = 400;
  const scale = previewH / paperH;
  const previewW = paperW * scale;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Layout Preview</h2>
        <p className="text-slate-500">
          This is an approximate visual representation of your selected settings.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-inner">
        
        {layout === 'SINGLE_PVC' ? (
          <div className="bg-white shadow-lg rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold" style={{ width: cardW * 3, height: cardH * 3 }}>
            CR80 PVC
          </div>
        ) : (
          <div 
            className="bg-white shadow-lg relative border border-slate-200"
            style={{ width: previewW, height: previewH }}
          >
            {/* Draw margin border */}
            <div 
              className="absolute border border-blue-200/50 border-dashed"
              style={{
                left: margin * scale,
                top: margin * scale,
                width: usableW * scale,
                height: usableH * scale
              }}
            />
            
            {/* Draw card grid */}
            <div 
              className="absolute flex flex-wrap"
              style={{
                left: margin * scale,
                top: margin * scale,
                width: usableW * scale,
                height: usableH * scale,
                gap: `${gapY * scale}px ${gapX * scale}px`
              }}
            >
              {Array.from({ length: Math.min(cardsPerPage, totalCardsToPrint) }).map((_, i) => (
                <div 
                  key={i}
                  className="bg-blue-100/50 border border-blue-300 rounded-[1px]"
                  style={{ width: cardW * scale, height: cardH * scale }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 max-w-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800">Job Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Cards:</span>
              <span className="font-semibold">{selectedCards.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Copies per Card:</span>
              <span className="font-semibold">{copies}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-50 pt-2 mt-2">
              <span className="text-slate-500">Total to Print:</span>
              <span className="font-bold text-blue-600">{totalCardsToPrint}</span>
            </div>
          </div>

          {layout !== 'SINGLE_PVC' && (
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
              <h4 className="font-bold text-slate-800">Layout Metrics</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Grid:</span>
                <span className="font-semibold">{cols}x{rows}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Cards per Page:</span>
                <span className="font-semibold">{cardsPerPage}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-50 pt-2 mt-2">
                <span className="text-slate-500">Estimated Pages:</span>
                <span className="font-bold text-indigo-600">{totalPages} {printSettings.duplex === 'FRONT_BACK' ? '(x2 for Back)' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl shadow-sm">
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold"
        >
          Proceed to Print Engine
        </Button>
      </div>
    </div>
  );
}
