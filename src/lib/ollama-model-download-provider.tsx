import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { getClient } from "@/lib/ollama-api-client";
import { useToast } from "@/hooks/use-toast";

type DownloadStatus = {
  isDownloading: boolean;
  status: string | null;
  total: number;
  completed: number;
  progress: number;
};

type OllamaModelDownloadContextType = {
  downloads: Record<string, DownloadStatus>;
  startDownload: (model: string) => void;
};

const OllamaModelDownloadContext = createContext<
  OllamaModelDownloadContextType | undefined
>(undefined);

const getProgressPercentage = (current: number, total: number): number =>
  Math.floor((current / total) * 100);

export const OllamaModelDownloadProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<Record<string, DownloadStatus>>(
    {}
  );

  const startDownload = useCallback(
    async (model: string) => {
      setDownloads((prev) => ({
        ...prev,
        [model]: {
          isDownloading: true,
          status: null,
          total: 0,
          completed: 0,
          progress: 0,
        },
      }));

      const response = await getClient().pull({ model, stream: true });

      for await (const part of response) {
        setDownloads((prev) => ({
          ...prev,
          [model]: {
            ...prev[model],
            status: part.status,
            total: part.total,
            completed: part.completed,
            progress: getProgressPercentage(part.completed, part.total),
          },
        }));
      }

      setDownloads((prev) => ({
        ...prev,
        [model]: {
          ...prev[model],
          isDownloading: false,
        },
      }));

      toast({
        title: "Download complete",
        description: `Model ${model} downloaded successfully`,
        duration: 5000,
      });
    },
    [toast]
  );

  return (
    <OllamaModelDownloadContext.Provider value={{ downloads, startDownload }}>
      {children}
    </OllamaModelDownloadContext.Provider>
  );
};

export const useOllamaModelDownloader = () => {
  const context = useContext(OllamaModelDownloadContext);
  if (!context) {
    throw new Error(
      "useOllamaModelDownloader must be used within an OllamaModelDownloadProvider"
    );
  }
  return { startDownload: context.startDownload };
};

export const useOllamaModelDownloadProgress = (model: string) => {
  const context = useContext(OllamaModelDownloadContext);
  if (!context) {
    throw new Error(
      "useOllamaModelDownloadProgress must be used within an OllamaModelDownloadProvider"
    );
  }

  const downloadProgress = useMemo(
    () => context.downloads[model],
    [context.downloads, model]
  );

  return (
    downloadProgress || {
      isDownloading: false,
      status: null,
      total: 0,
      completed: 0,
      progress: 0,
    }
  );
};
