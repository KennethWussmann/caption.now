import { Card } from "@/components/ui";
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { LoaderCircle, RefreshCw } from "lucide-react";

export const CaptionPreviewAI = () => {
  const { parts, preview, isLoadingPreview, refetchPreview } = useCaptionEditor();
  const isEmpty = parts.length === 0;

  return (
    <div className="my-2 py-2">
      <div className="flex flex-row gap-2 mb-2 font-semibold items-center">
        Preview {isLoadingPreview && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {!isLoadingPreview && (
          <RefreshCw className="h-4 w-4" onClick={() => refetchPreview()} />
        )}
      </div>

      {(isEmpty || !preview || preview.length === 0) && (
        <Card className="p-1 px-2 italic text-muted-foreground text-center">
          No caption
        </Card>
      )}

      {!isEmpty && preview && (
        <Card className="p-1 px-2 max-h-[200px] overflow-y-auto">{preview}</Card>
      )}
    </div>
  );
};
