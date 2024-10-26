import { getModels, pullModel } from "@/lib/ollama-api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, LoaderCircle } from "lucide-react";

export const DownloadRecommendedModel = ({ model }: { model: string }) => {
  const { data, isLoading, isError, isLoadingError, refetch } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    refetchInterval: 1000,
  });

  const {
    mutateAsync,
    data: pullModelResponse,
    isPending,
  } = useMutation({
    mutationKey: ["pull-model", model],
    mutationFn: () => pullModel(model),
    onSuccess() {
      refetch();
    },
    onError() {
      refetch();
    },
  });

  const isFound =
    data?.find((m) =>
      model.includes(":") ? m.name === model : m.name.split(":")[0] === model
    ) ?? false;

  if (isLoading || isError || isLoadingError) {
    return null;
  }

  if (isPending) {
    return (
      <div className="flex gap-2 items-center">
        <LoaderCircle className="animate-spin h-4 w-4" />
        <span className="text-muted-foreground">
          Downloading... Don't close this page!
        </span>
      </div>
    );
  }
  if (
    pullModelResponse?.completed !== undefined &&
    pullModelResponse.status === "success"
  ) {
    return (
      <div className="flex gap-2 items-center">
        <Check className="h-4 w-4" />
        <span className="text-muted-foreground">
          Model downloaded successfully!
        </span>
      </div>
    );
  }
  if (
    pullModelResponse?.completed !== undefined &&
    pullModelResponse.status !== "success"
  ) {
    return (
      <div className="flex gap-2 items-center">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-destructive">
          Something went wrong while downloading the model.
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
        onClick={() => mutateAsync()}
      >
        Download
      </span>
    </div>
  );
};
