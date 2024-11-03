import { useToast } from "@/hooks/use-toast";
import { createContext, useState, useCallback, useContext, useEffect } from "react";
import { ExportItem, ExportType } from "./types";
import { useImages } from "@/hooks/use-images";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { CaptionTxtTask } from "./task/caption-txt-task";
import { useShortcut } from "@/hooks/use-shortcut";

type Progress = {
  done: number;
  total: number;
  percentage: number;
};

type ExportProgressContextType = {
  type: ExportType;
  progress: Progress;
  startExport: () => void;
  isExporting?: boolean;
  isDone?: boolean;
  reset: () => void;
}

export const ExportProgressContext = createContext<ExportProgressContextType>({
  type: "caption-txt",
  progress: { done: 0, total: 0, percentage: 0 },
  startExport: () => { },
  reset: () => { },
});

export const ExportProgressProvider: React.FC<{ children: React.ReactNode, type: ExportType }> = ({
  children, type
}) => {
  const { directoryHandle } = useDatasetDirectory();
  const { doneImages } = useImages();
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 10, percentage: 0 });
  const [isExporting, setExporting] = useState(false);
  const [isDone, setDone] = useState(false);
  const { toast } = useToast();
  const canExport = doneImages.length > 0;
  useShortcut("startExport", () => {
    startExport();
  })

  const startExport = useCallback(async () => {
    if (!directoryHandle || isExporting || !canExport) {
      return
    }
    setExporting(true);
    setDone(false)
    const totalItems = doneImages.length;
    setProgress({ done: 0, total: doneImages.length, percentage: 0 });

    for (let i = 1; i <= totalItems; i++) {
      const image = doneImages[i - 1];
      const item: ExportItem = {
        image,
        directoryHandle
      }
      switch (type) {
        case "caption-txt":
          await CaptionTxtTask.export(item);
          break;
        case "sort":
          // TODO: Implement sort export
          break;
        default:
          break;
      }
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
  }, [directoryHandle, doneImages, isDone, isExporting, toast, type]);

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

  return (
    <ExportProgressContext.Provider value={{ type, progress, startExport, isExporting, reset, isDone }}>
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