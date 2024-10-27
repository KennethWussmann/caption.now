import { Card, CardContent } from "@/components/ui";
import { Progress } from "@/components/ui/progress";
import { productName } from "@/lib/constants";
import { getModels } from "@/lib/ollama-api-client";
import {
  useOllamaModelDownloader,
  useOllamaModelDownloadProgress,
} from "@/lib/ollama-model-download-provider";
import { useQuery } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";

export const DownloadRecommendedModel = ({ model }: { model: string }) => {
  const { data, isLoading, isError, isLoadingError } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchInterval: 1000,
  });
  const { startDownload } = useOllamaModelDownloader();
  const { isDownloading, status, completed, total, progress } =
    useOllamaModelDownloadProgress(model);

  const isFound =
    data?.find((m) =>
      model.includes(":") ? m.name === model : m.name.split(":")[0] === model
    ) ?? false;

  if (isLoading || isError || isLoadingError) {
    return null;
  }

  if (isDownloading) {
    return (
      <Card>
        <CardContent className="py-6 px-8 flex gap-2 flex-col">
          <div className="flex gap-2 items-center justify-center animate-pulse">
            <LoaderCircle className="animate-spin h-4 w-4" />
            {status}...
          </div>
          <Progress value={progress} />
          {progress > 0 && (
            <div className="flex gap-2 items-center justify-center text-muted-foreground text-xs font-mono">
              {progress}%{" "}
              {completed > 0 && total > 0 && `(${completed} / ${total})`}
            </div>
          )}
          <div className="flex items-center justify-center text-muted-foreground text-xs mt-4">
            You can close the settings and continue using {productName}. Just
            don't refresh the page. We will notify you when the download is
            complete.
          </div>
        </CardContent>
      </Card>
    );
  }
  if (status === "success") {
    return (
      <div className="flex gap-2 items-center text-green-500">
        <Check className="h-4 w-4" />
        Model downloaded successfully!
      </div>
    );
  }

  if (isFound) {
    return null;
  }

  return (
    <div className="text-destructive">
      Our recommended model <span className="font-bold">"{model}"</span> was not
      found. Would you like to download and install it automatically?{" "}
      <span
        className="text-blue-500 hover:underline cursor-pointer"
        onClick={() => startDownload(model)}
      >
        Download
      </span>
    </div>
  );
};
