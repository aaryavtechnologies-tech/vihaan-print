"use client";

import { useEffect, useState } from "react";
import { usePrintStore, MOCK_STUDENTS } from "../../store/print-store";
import { useEditorStore } from "../../store/editor-store";
import { OffscreenRenderer } from "./OffscreenRenderer";
import { EDITOR_CONSTANTS } from "../../constants/editor-constants";

export function BatchRenderer() {
  const { queue, updateQueueItem, settings } = usePrintStore();
  const { elements } = useEditorStore();
  
  const canvasWidth = EDITOR_CONSTANTS.CARD_WIDTH_PX;
  const canvasHeight = EDITOR_CONSTANTS.CARD_HEIGHT_PX;
  const backgroundColor = "#ffffff";
  
  // Find the first IDLE job in the queue
  const currentJob = queue.find(q => q.status === "IDLE" || q.status === "GENERATING");
  
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentJob && currentJob.status === "IDLE" && processingId !== currentJob.id) {
      setProcessingId(currentJob.id);
      updateQueueItem(currentJob.id, { status: "GENERATING" });
    }
  }, [currentJob, processingId, updateQueueItem]);

  if (!currentJob || currentJob.status !== "GENERATING") {
    return null;
  }

  const studentData = MOCK_STUDENTS.find(s => s.id === currentJob.studentId);
  
  if (!studentData) {
    // Failsafe
    updateQueueItem(currentJob.id, { status: "FAILED", error: "Student data not found" });
    setProcessingId(null);
    return null;
  }

  const handleRenderComplete = (dataUrl: string) => {
    updateQueueItem(currentJob.id, { 
      status: "COMPLETED", 
      dataUrl,
      progress: 100 
    });
    setProcessingId(null);
  };

  const handleError = (error: Error) => {
    updateQueueItem(currentJob.id, { 
      status: "FAILED", 
      error: error.message 
    });
    setProcessingId(null);
  };

  return (
    <OffscreenRenderer
      templateWidth={canvasWidth}
      templateHeight={canvasHeight}
      backgroundColor={backgroundColor}
      elements={elements}
      studentData={studentData}
      dpi={settings.dpi}
      onRenderComplete={handleRenderComplete}
      onError={handleError}
    />
  );
}
