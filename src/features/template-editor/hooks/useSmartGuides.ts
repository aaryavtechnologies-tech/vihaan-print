import { useState, RefObject } from "react";
import Konva from "konva";
import { EditorElement } from "../types/element-types";

// Snap threshold in pixels
const SNAP_THRESHOLD = 5;

interface LineGuide {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  orientation: 'V' | 'H';
}

export function useSmartGuides(
  stageRef: RefObject<Konva.Stage | null>,
  elements: EditorElement[],
  snapEnabled: boolean,
  gridEnabled: boolean
) {
  const [guides, setGuides] = useState<LineGuide[]>([]);

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!snapEnabled || !stageRef.current) {
      setGuides([]);
      return;
    }

    const node = e.target;
    // We only snap element groups
    if (node.name() !== "element-group") return;

    const stage = stageRef.current;
    
    // Canvas dimensions
    const stageWidth = stage.width();
    const stageHeight = stage.height();

    // Reset guides
    const newGuides: LineGuide[] = [];

    // Current node bounding box
    const box = node.getClientRect();
    const boxCenterX = box.x + box.width / 2;
    const boxCenterY = box.y + box.height / 2;

    let snappedX = false;
    let snappedY = false;

    let targetX = node.x();
    let targetY = node.y();

    // 1. Grid Snapping (if grid enabled, it overrides smart guides for simplicity, or we can combine)
    // For now, if grid is enabled, we snap to 10px grid.
    if (gridEnabled) {
      targetX = Math.round(targetX / 10) * 10;
      targetY = Math.round(targetY / 10) * 10;
      node.position({ x: targetX, y: targetY });
      setGuides([]);
      return;
    }

    // 2. Center of Canvas Snapping
    if (Math.abs(boxCenterX - stageWidth / 2) < SNAP_THRESHOLD) {
      targetX = stageWidth / 2 - box.width / 2;
      snappedX = true;
      newGuides.push({ id: 'v-center', x1: stageWidth / 2, y1: 0, x2: stageWidth / 2, y2: stageHeight, orientation: 'V' });
    }
    if (Math.abs(boxCenterY - stageHeight / 2) < SNAP_THRESHOLD) {
      targetY = stageHeight / 2 - box.height / 2;
      snappedY = true;
      newGuides.push({ id: 'h-center', x1: 0, y1: stageHeight / 2, x2: stageWidth, y2: stageHeight / 2, orientation: 'H' });
    }

    // 3. Sibling Elements Snapping (Edges and Centers)
    if (!snappedX || !snappedY) {
      const siblings = stage.find('.element-group').filter(n => n !== node);
      
      for (let sibling of siblings) {
        const sibBox = sibling.getClientRect();
        
        // Vertical Snapping (X axis matches)
        if (!snappedX) {
          // Snap Left to Left
          if (Math.abs(box.x - sibBox.x) < SNAP_THRESHOLD) {
            targetX = sibBox.x;
            snappedX = true;
            newGuides.push({ id: `v-l-${sibling.id()}`, x1: sibBox.x, y1: 0, x2: sibBox.x, y2: stageHeight, orientation: 'V' });
          }
          // Snap Right to Right
          else if (Math.abs((box.x + box.width) - (sibBox.x + sibBox.width)) < SNAP_THRESHOLD) {
            targetX = sibBox.x + sibBox.width - box.width;
            snappedX = true;
            newGuides.push({ id: `v-r-${sibling.id()}`, x1: sibBox.x + sibBox.width, y1: 0, x2: sibBox.x + sibBox.width, y2: stageHeight, orientation: 'V' });
          }
        }

        // Horizontal Snapping (Y axis matches)
        if (!snappedY) {
          // Snap Top to Top
          if (Math.abs(box.y - sibBox.y) < SNAP_THRESHOLD) {
            targetY = sibBox.y;
            snappedY = true;
            newGuides.push({ id: `h-t-${sibling.id()}`, x1: 0, y1: sibBox.y, x2: stageWidth, y2: sibBox.y, orientation: 'H' });
          }
          // Snap Bottom to Bottom
          else if (Math.abs((box.y + box.height) - (sibBox.y + sibBox.height)) < SNAP_THRESHOLD) {
            targetY = sibBox.y + sibBox.height - box.height;
            snappedY = true;
            newGuides.push({ id: `h-b-${sibling.id()}`, x1: 0, y1: sibBox.y + sibBox.height, x2: stageWidth, y2: sibBox.y + sibBox.height, orientation: 'H' });
          }
        }
      }
    }

    if (snappedX || snappedY) {
      node.position({ x: targetX, y: targetY });
    }
    
    setGuides(newGuides);
  };

  const onDragEnd = () => {
    setGuides([]);
  };

  return {
    guides,
    onDragMove,
    onDragEnd
  };
}
