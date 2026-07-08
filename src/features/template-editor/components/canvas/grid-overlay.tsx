"use client";

import { Group, Line } from "react-konva";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";

interface GridOverlayProps {
  width: number;
  height: number;
}

export function GridOverlay({ width, height }: GridOverlayProps) {
  const gridSize = EDITOR_CONSTANTS.DEFAULT_GRID_SIZE;
  const lines = [];

  // Vertical lines
  for (let i = 0; i < width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[Math.round(i * gridSize) + 0.5, 0, Math.round(i * gridSize) + 0.5, height]}
        stroke="#e2e8f0"
        strokeWidth={1}
        dash={[4, 4]}
      />
    );
  }

  // Horizontal lines
  for (let j = 0; j < height / gridSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, Math.round(j * gridSize) + 0.5, width, Math.round(j * gridSize) + 0.5]}
        stroke="#e2e8f0"
        strokeWidth={1}
        dash={[4, 4]}
      />
    );
  }

  return <Group opacity={0.5}>{lines}</Group>;
}
