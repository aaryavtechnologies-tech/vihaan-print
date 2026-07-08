"use client";

import { useEffect, useState, useRef } from "react";
import { useGenerationStore } from "../../store/generation-store";
import { createGenerationJob, completeGenerationJob, saveGeneratedCardsChunk } from "../../actions/generation-actions";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { OffscreenRenderer } from "@/features/template-editor/components/render/OffscreenRenderer";
import { getTemplateForEditor } from "@/features/template-editor/server/template-actions";

export function Step5Generate() {
  const router = useRouter();
  const { 
    filters, templateId, studentsData, 
    progress, updateProgress, setJobId, jobId, reset 
  } = useGenerationStore();
  
  const [template, setTemplate] = useState<any>(null);
  
  // Rendering Loop State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [results, setResults] = useState({ success: 0, failed: 0 });
  const [currentChunk, setCurrentChunk] = useState<any[]>([]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !templateId) return;
    hasInitialized.current = true;
    
    getTemplateForEditor(templateId).then(template => {
      if (template) setTemplate(template);
    });
  }, [templateId]);

  useEffect(() => {
    if (!isStarted && template && studentsData.length > 0) {
      startGeneration();
    }
  }, [template]);

  const startGeneration = async () => {
    setIsStarted(true);
    updateProgress({ status: 'PROCESSING', total: studentsData.length, current: 0 });

    try {
      const jobRes = await createGenerationJob(filters.schoolId, studentsData.length);
      if (!jobRes.success || !jobRes.jobId) throw new Error("Failed to create job");
      
      setJobId(jobRes.jobId);
    } catch (error) {
      console.error(error);
      updateProgress({ status: 'FAILED' });
    }
  };

  const handleRenderComplete = async (dataUrl: string) => {
    if (progress.status === 'FAILED') return; // Stop if failed

    const student = studentsData[currentIndex];
    
    const renderedCard = {
      studentId: student.id, // Database ID
      schoolId: filters.schoolId,
      templateId: templateId,
      frontDataUrl: dataUrl,
      backDataUrl: null, // Add back rendering logic here if needed in future
    };

    const newChunk = [...currentChunk, renderedCard];
    
    if (newChunk.length >= 20 || currentIndex === studentsData.length - 1) {
      // Process chunk
      const res = await saveGeneratedCardsChunk(jobId!, newChunk);
      
      if (res.success) {
        setResults(prev => ({ 
          success: prev.success + (res.successCount || 0), 
          failed: prev.failed + (res.failCount || 0) 
        }));
      } else {
        setResults(prev => ({ ...prev, failed: prev.failed + newChunk.length }));
      }
      
      setCurrentChunk([]);
    } else {
      setCurrentChunk(newChunk);
    }

    const nextIndex = currentIndex + 1;
    updateProgress({ current: nextIndex });

    if (nextIndex < studentsData.length) {
      // Proceed to next student
      setCurrentIndex(nextIndex);
    } else {
      // Done
      await completeGenerationJob(jobId!, "COMPLETED");
      updateProgress({ status: 'COMPLETED' });
    }
  };

  const handleRenderError = async (err: Error) => {
    console.error("Render Error:", err);
    // Even if one fails, continue to next
    const newChunk = [...currentChunk]; // We just don't add the failed one
    setResults(prev => ({ ...prev, failed: prev.failed + 1 }));

    const nextIndex = currentIndex + 1;
    updateProgress({ current: nextIndex });

    if (nextIndex < studentsData.length) {
      setCurrentIndex(nextIndex);
    } else {
      await saveGeneratedCardsChunk(jobId!, newChunk); // Save remaining chunk
      await completeGenerationJob(jobId!, "COMPLETED");
      updateProgress({ status: 'COMPLETED' });
    }
  };

  const handleFinish = () => {
    reset();
    router.push("/dashboard/generated-cards");
  };

  if (progress.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-bold text-slate-800">Generation Failed</h3>
        <p className="text-slate-500 mt-2">A critical system error occurred during the process.</p>
        <Button onClick={() => router.push("/dashboard/generate")} className="mt-8">Try Again</Button>
      </div>
    );
  }

  if (progress.status === 'COMPLETED') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Generation Complete!</h2>
          <p className="text-slate-500 text-lg">Your ID cards have been successfully generated and saved to Cloudinary.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
            <div className="text-4xl font-bold text-emerald-700 mb-1">{results.success}</div>
            <div className="text-sm font-medium text-emerald-600">Successfully Generated</div>
          </div>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
            <div className="text-4xl font-bold text-red-700 mb-1">{results.failed}</div>
            <div className="text-sm font-medium text-red-600">Failed</div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleFinish}
            className="h-12 px-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all font-semibold text-lg"
          >
            View Generated Cards
          </Button>
        </div>
      </div>
    );
  }

  const currentStudent = studentsData[currentIndex];
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Generating Batch ID Cards...</h3>
      <p className="text-slate-500 mb-8">Please keep this tab open. Your browser is actively rendering cards.</p>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-600">
          <span>Processing {progress.current} of {progress.total}</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {template && currentStudent && (
        <OffscreenRenderer
          templateWidth={template.canvasWidth || 638}
          templateHeight={template.canvasHeight || 1016}
          backgroundColor={template.currentVersion?.jsonData?.backgroundColor || "#ffffff"}
          elements={template.currentVersion?.jsonData?.elements || []}
          studentData={{
            id: currentStudent.id,
            student_id: currentStudent.studentId,
            admission_no: currentStudent.admissionNo,
            student_name: currentStudent.fullName,
            class_name: currentStudent.className,
            section: currentStudent.section,
            student_photo: currentStudent.photo,
            father_name: currentStudent.fatherName,
            mother_name: currentStudent.motherName,
            dob: currentStudent.dateOfBirth ? new Date(currentStudent.dateOfBirth).toLocaleDateString() : "",
            blood_group: currentStudent.bloodGroup,
            student_mobile: currentStudent.studentMobile,
            address: currentStudent.addressLine1,
            school_name: "School Name",
          }}
          dpi={template.dpi || 300}
          onRenderComplete={handleRenderComplete}
          onError={handleRenderError}
        />
      )}
    </div>
  );
}
