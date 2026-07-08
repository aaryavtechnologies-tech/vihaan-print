"use client";

import { useEditorStore } from "../../store/editor-store";
import { Button } from "@/components/ui/button";
import { 
  AlignLeft, AlignCenter, AlignRight, 
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  AlignEndHorizontal, AlignHorizontalSpaceAround, AlignStartVertical, AlignEndVertical
} from "lucide-react";

export function AlignmentToolbar() {
  const { selectedObjectIds, elements, updateElements, saveHistorySnapshot } = useEditorStore();

  if (selectedObjectIds.length < 2) return null;

  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selected = elements.filter(el => selectedObjectIds.includes(el.id) && !el.locked);
    if (selected.length === 0) return;

    let targetX = 0;
    let targetY = 0;

    // Find bounding box of all selected
    const minX = Math.min(...selected.map(el => el.x));
    const maxX = Math.max(...selected.map(el => el.x + el.width));
    const minY = Math.min(...selected.map(el => el.y));
    const maxY = Math.max(...selected.map(el => el.y + el.height));
    const midX = minX + (maxX - minX) / 2;
    const midY = minY + (maxY - minY) / 2;

    const updates: { id: string; changes: any }[] = [];

    selected.forEach(el => {
      let x = el.x;
      let y = el.y;

      switch (type) {
        case 'left': x = minX; break;
        case 'center': x = midX - el.width / 2; break;
        case 'right': x = maxX - el.width; break;
        case 'top': y = minY; break;
        case 'middle': y = midY - el.height / 2; break;
        case 'bottom': y = maxY - el.height; break;
      }
      
      updates.push({ id: el.id, changes: { x, y } });
    });

    saveHistorySnapshot();
    updateElements(updates);
  };

  const handleDistribute = (type: 'horizontal' | 'vertical') => {
    const selected = elements.filter(el => selectedObjectIds.includes(el.id) && !el.locked);
    if (selected.length < 3) return; // Need at least 3 to distribute

    // Sort by coordinate
    const sorted = [...selected].sort((a, b) => type === 'horizontal' ? a.x - b.x : a.y - b.y);
    
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalSpace = type === 'horizontal'
      ? (last.x + last.width) - first.x
      : (last.y + last.height) - first.y;

    const totalElementSpace = sorted.reduce((sum, el) => sum + (type === 'horizontal' ? el.width : el.height), 0);
    const gap = (totalSpace - totalElementSpace) / (sorted.length - 1);

    const updates: { id: string; changes: any }[] = [];
    let currentPos = type === 'horizontal' ? first.x : first.y;

    sorted.forEach((el, index) => {
      if (type === 'horizontal') {
        updates.push({ id: el.id, changes: { x: currentPos } });
        currentPos += el.width + gap;
      } else {
        updates.push({ id: el.id, changes: { y: currentPos } });
        currentPos += el.height + gap;
      }
    });

    saveHistorySnapshot();
    updateElements(updates);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg flex items-center p-1.5 gap-1 z-50">
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-800">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('left')} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('center')} title="Align Horizontal Center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('right')} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-800">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('top')} title="Align Top">
          <AlignEndHorizontal className="h-4 w-4 rotate-180" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('middle')} title="Align Vertical Center">
          <AlignHorizontalSpaceAround className="h-4 w-4 rotate-90" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAlign('bottom')} title="Align Bottom">
          <AlignEndHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-0.5">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => handleDistribute('horizontal')} 
          disabled={selectedObjectIds.length < 3}
          title="Distribute Horizontally"
        >
          <AlignHorizontalDistributeCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => handleDistribute('vertical')} 
          disabled={selectedObjectIds.length < 3}
          title="Distribute Vertically"
        >
          <AlignVerticalDistributeCenter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
