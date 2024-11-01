import { Card } from "@/components/ui";
import { useCaptionRefiner } from "@/hooks/ai/use-caption-refiner";
import { useCaptionEditor } from "@/hooks/provider/caption-editor-provider";
import { LoaderCircle, RefreshCw } from "lucide-react";

export const CaptionPreviewAI = () => {
  const { parts, isDirty } = useCaptionEditor();
  const { captionSuggestion, isLoading, refetch } = useCaptionRefiner({
    skip: !isDirty,
  });
  const isEmpty = parts.length === 0;

  // TODO: Dont write caption to file, but to the database and then export from there to file
  // useEffect(() => {
  //   if (!imageFile || !captionSuggestion || captionSuggestion.length < 3) {
  //     return;
  //   }
  //   writeCaption(captionSuggestion, imageFile);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [captionSuggestion, writeCaption]);

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
