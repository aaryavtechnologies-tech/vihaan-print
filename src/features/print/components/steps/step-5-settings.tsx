"use client";

import { usePrintStore } from "../../store/print-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings2, Layers, Printer, Maximize, GripHorizontal } from "lucide-react";

export function Step5Settings() {
  const { layoutSettings, setLayoutSettings, printSettings, setPrintSettings, nextStep, prevStep } = usePrintStore();

  const isGrid = layoutSettings.layout !== 'SINGLE_PVC';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Print Configuration</h2>
        <p className="text-slate-500">Fine-tune the margins, duplex mode, and output quality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hardware Settings */}
        <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-2">
            <Printer className="w-5 h-5 text-blue-600" /> Print Hardware
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Duplex Mode</label>
            <Select value={printSettings.duplex} onValueChange={(val: any) => setPrintSettings({ duplex: val })}>
              <SelectTrigger className="h-12 bg-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FRONT_ONLY">Front Only</SelectItem>
                <SelectItem value="BACK_ONLY">Back Only</SelectItem>
                <SelectItem value="FRONT_BACK">Front + Back (Duplex)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Output Quality (DPI)</label>
            <Select value={printSettings.dpi.toString()} onValueChange={(val) => setPrintSettings({ dpi: parseInt(val || "300") as any })}>
              <SelectTrigger className="h-12 bg-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="150">150 DPI (Draft)</SelectItem>
                <SelectItem value="300">300 DPI (Standard)</SelectItem>
                <SelectItem value="600">600 DPI (High Res)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Copies Per Card</label>
            <Input 
              type="number" 
              min={1} 
              max={100}
              value={printSettings.copies} 
              onChange={(e) => setPrintSettings({ copies: parseInt(e.target.value) || 1 })}
              className="h-12 bg-white rounded-xl"
            />
          </div>
        </div>

        {/* Layout Settings (Only relevant for A4 Grids) */}
        <div className={`space-y-6 p-6 rounded-3xl border ${isGrid ? 'bg-slate-50 border-slate-100' : 'bg-slate-50/50 border-slate-100/50 opacity-60 pointer-events-none'}`}>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mb-2">
            <Maximize className="w-5 h-5 text-indigo-600" /> Grid Dimensions
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Paper Size</label>
            <Select value={printSettings.paperSize} onValueChange={(val: any) => setPrintSettings({ paperSize: val })}>
              <SelectTrigger className="h-12 bg-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                <SelectItem value="A3">A3 (297 x 420 mm)</SelectItem>
                <SelectItem value="LETTER">US Letter</SelectItem>
                <SelectItem value="LEGAL">US Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Page Margin (mm)</label>
              <Input 
                type="number" 
                value={layoutSettings.margin} 
                onChange={(e) => setLayoutSettings({ margin: parseInt(e.target.value) || 0 })}
                className="h-12 bg-white rounded-xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Card Gap (mm)</label>
              <Input 
                type="number" 
                value={layoutSettings.gapX} // Using gapX to set both for simplicity
                onChange={(e) => setLayoutSettings({ gapX: parseInt(e.target.value) || 0, gapY: parseInt(e.target.value) || 0 })}
                className="h-12 bg-white rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              <p className="font-semibold text-slate-800">Crop Marks</p>
              <p className="text-xs text-slate-500">Draw cut lines between cards</p>
            </div>
            <Switch 
              checked={layoutSettings.cropMarks}
              onCheckedChange={(val) => setLayoutSettings({ cropMarks: val })}
            />
          </div>
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
          View Preview
        </Button>
      </div>
    </div>
  );
}
