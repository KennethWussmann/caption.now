import { Card } from "@/components/ui";
import { useCaptionRefiner } from "@/hooks/ai/use-caption-refiner";
import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { useImageCaption } from "@/lib/image-caption-provider";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export const CaptionPreviewAI = () => {
  const { caption, imageFile, isDirty } = useImageCaption();
  const { captionSuggestion, isLoading, refetch } = useCaptionRefiner({
    skip: !isDirty,
  });
  const { writeCaption } = useDatasetDirectory();
  const isEmpty = caption.parts.length === 0;

  useEffect(() => {
    if (!imageFile || !captionSuggestion || captionSuggestion.length < 3) {
      return;
    }
    writeCaption(captionSuggestion, imageFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captionSuggestion, writeCaption]);

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
