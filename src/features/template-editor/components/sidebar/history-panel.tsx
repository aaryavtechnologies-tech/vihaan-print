"use client";

import { useEffect, useState } from "react";
import { getTemplateHistory, restoreVersion } from "../../server/template-actions";
import { useEditorStore } from "../../store/editor-store";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function timeAgo(dateParam: Date | string | number) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  
  if (seconds < 5) return 'just now';
  else if (seconds < 60) return `${seconds} seconds ago`;
  else if (seconds < 90) return 'about a minute ago';
  else if (minutes < 60) return `${minutes} minutes ago`;
  else if (isToday) return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}`;
  return date.toLocaleDateString();
}

export function HistoryPanel() {
  const { currentTemplateId, setElements } = useEditorStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!currentTemplateId) return;
    
    let isMounted = true;
    setLoading(true);
    
    getTemplateHistory(currentTemplateId)
      .then((data) => {
        if (isMounted) {
          setHistory(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
      
    return () => { isMounted = false; };
  }, [currentTemplateId]);

  const handleRestore = async (versionId: string) => {
    if (!currentTemplateId) return;
    try {
      setRestoring(versionId);
      const res = await restoreVersion(currentTemplateId, versionId);
      if (res.success && res.jsonData) {
        // Assume jsonData has elements, canvasPosition, zoomLevel
        const data = res.jsonData as any;
        if (data.elements) {
          setElements(data.elements);
        }
        // Need to refetch history to show the new "restored" version
        const newHistory = await getTemplateHistory(currentTemplateId);
        setHistory(newHistory);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRestoring(null);
    }
  };

  if (!currentTemplateId) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm p-4 text-center">
        <History className="w-8 h-8 mb-2 opacity-20" />
        <p>Save this template first to track its version history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.length === 0 ? (
        <div className="text-center text-sm text-slate-500 py-8">No history found.</div>
      ) : (
        history.map((version) => (
          <div 
            key={version.id}
            className="flex flex-col p-3 rounded-md border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Version {version.version}</span>
              {version.published && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Published
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-500 mb-3">
              {version.changeLog || "No changelog provided"}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] text-slate-400">
                {timeAgo(version.createdAt)}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2"
                disabled={restoring === version.id}
                onClick={() => handleRestore(version.id)}
              >
                {restoring === version.id ? (
                  <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                ) : (
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                )}
                Restore
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
