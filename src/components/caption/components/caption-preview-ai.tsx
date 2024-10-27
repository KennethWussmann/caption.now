import { Card } from "@/components/ui";
import { useCaptionRefiner } from "@/hooks/ai/use-caption-refiner";
import { useImageCaption } from "@/lib/image-caption-provider";
import { LoaderCircle, RefreshCw } from "lucide-react";

export const CaptionPreviewAI = () => {
  const { captionSuggestion, isLoading, refetch } = useCaptionRefiner();
  const { caption } = useImageCaption();
  const isEmpty = caption.parts.length === 0;

  return (
    <div className="my-2 py-2">
      <div className="flex flex-row gap-2 mb-2 font-semibold items-center">
        Preview {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {!isLoading && (
          <RefreshCw className="h-4 w-4" onClick={() => refetch()} />
        )}
      </div>

      {(isEmpty || !captionSuggestion || captionSuggestion.length === 0) && (
        <Card className="p-1 px-2 italic text-muted-foreground text-center">
          No caption
        </Card>
      )}

      {!isEmpty && captionSuggestion && (
        <Card className="p-1 px-2">{captionSuggestion}</Card>
      )}
    </div>
  );
};
