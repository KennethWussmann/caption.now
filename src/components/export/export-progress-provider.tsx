import { useToast } from "@/hooks/use-toast";
import { createContext, useState, useCallback, useContext, useEffect, useMemo } from "react";
import { ExportItem, ExportTask, ExportType } from "./types";
import { useImages } from "@/hooks/use-images";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { useShortcut } from "@/hooks/use-shortcut";
import { tasks } from "./task";

type Progress = {
  done: number;
  total: number;
  percentage: number;
};

type ExportProgressContextType = {
  type: ExportType;
  task: ExportTask;
  progress: Progress;
  startExport: () => void;
  isExporting?: boolean;
  isDone?: boolean;
  reset: () => void;
  items: ExportItem[];
  isEnabled: boolean;
}

export const ExportProgressContext = createContext<ExportProgressContextType>({
  type: "caption-txt",
  task: tasks["caption-txt"],
  items: [],
  progress: { done: 0, total: 0, percentage: 0 },
  startExport: () => { },
  reset: () => { },
  isEnabled: false,
});

export const ExportProgressProvider: React.FC<{ children: React.ReactNode, type: ExportType }> = ({
  children, type
}) => {
  const task = tasks[type];
  const { directoryHandle } = useDatasetDirectory();
  const { allImages } = useImages();
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 10, percentage: 0 });
  const [isExporting, setExporting] = useState(false);
  const [isDone, setDone] = useState(false);
  const { toast } = useToast();
  const items = useMemo(() => {
    if (!directoryHandle) {
      return []
    }
    return allImages
      .map((image) => ({ image, directoryHandle }))
      .filter((item) => task.filter(item))
  }, [allImages, directoryHandle, task]);

  useShortcut("startExport", () => {
    startExport();
  })

  const startExport = useCallback(async () => {
    if (isExporting || items.length === 0) {
      return
    }
    setExporting(true);
    setDone(false)

    const totalItems = items.length;
    setProgress({ done: 0, total: items.length, percentage: 0 });
    for (let i = 1; i <= totalItems; i++) {
      const item = items[i - 1];

      await task.export(item);

      setProgress({
        done: i,
        total: totalItems,
        percentage: Math.round((i / totalItems) * 100),
      });
    }
    setDone(true)
    setExporting(false);
    toast({
      title: "Export complete",
    });
  }, [task, isExporting, items, toast]);

  const reset = () => {
    setProgress({ done: 0, total: 0, percentage: 0 });
    setExporting(false);
    setDone(false);
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDone) {
      timeout = setTimeout(() => {
        reset();
      }, 30000);
    }
    return () => {
      if (timeout) { clearTimeout(timeout) }
    }
  }, [isDone])

  useEffect(() => { }, [allImages])

  return (
    <ExportProgressContext.Provider value={{
      type,
      task,
      progress,
      startExport,
      isExporting,
      reset,
      isDone,
      items,
      isEnabled: items.length > 0,
    }}>
      {children}
    </ExportProgressContext.Provider>
  );
};

export const useExportProgress = () => {
  const context = useContext(ExportProgressContext);

  if (!context) {
    throw new Error("useExportProgress must be used within an ExportProgressProvider");
  }

  return context;
};