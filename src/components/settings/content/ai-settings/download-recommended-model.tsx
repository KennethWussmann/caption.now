import { Card, CardContent } from "@/components/ui";
import { Progress } from "@/components/ui/progress";
import { useOllamaModelDownloader } from "@/hooks/use-ollama-model-downloader";
import { getModels } from "@/lib/ollama-api-client";
import { useQuery } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";

export const DownloadRecommendedModel = ({ model }: { model: string }) => {
  const { data, isLoading, isError, isLoadingError } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchInterval: 1000,
  });
  const { download, isDownloading, status, completed, total, progress } =
    useOllamaModelDownloader();

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
          <div className="flex gap-2 items-center justify-center text-muted-foreground">
            <LoaderCircle className="animate-spin h-4 w-4" />
            {status}... Don't close this page!{" "}
          </div>
          <Progress value={progress} />
          {progress > 0 && (
            <div className="flex gap-2 items-center justify-center text-muted-foreground text-xs font-mono">
              {progress}%{" "}
              {completed > 0 && total > 0 && `(${completed} / ${total})`}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  if (status === "success") {
    return (
      <div className="flex gap-2 items-center">
        <Check className="h-4 w-4" />
        <span className="text-muted-foreground">
          Model downloaded successfully!
        </span>
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
        onClick={() => download(model)}
      >
        Download
      </span>
    </div>
  );
};
