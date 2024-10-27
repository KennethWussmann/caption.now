import { getClient } from "@/lib/ollama-api-client";
import { useState } from "react";

const getProgressPercentage = (current: number, total: number): number =>
  Math.floor((current / total) * 100);

export const useOllamaModelDownloader = () => {
  const [isDownloading, setDownloading] = useState(false);
  const [status, setStatus] = useState<string | null>();
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const download = async (model: string) => {
    setDownloading(true);
    const response = await getClient().pull({
      model,
      stream: true,
    });
    for await (const part of response) {
      setStatus(part.status);
      setTotal(part.total);
      setCompleted(part.completed);
      setProgress(getProgressPercentage(part.completed, part.total));
    }

    setDownloading(false);
  };

  return {
    isDownloading,
    status,
    total,
    completed,
    progress,
    download,
  };
};
