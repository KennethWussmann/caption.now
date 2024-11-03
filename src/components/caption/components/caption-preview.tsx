import { Card } from "@/components/ui";
import { useCaptionEditor } from "@/hooks/provider/caption-editor-provider";

export const CaptionPreview = () => {
  const { preview } = useCaptionEditor();

  return (
    <div className="my-2 py-2">
      <div className="flex flex-row gap-2 mb-2 font-semibold items-center">
        Preview
      </div>

      {!preview && (
        <Card className="p-1 px-2 italic text-muted-foreground text-center">
          No caption
        </Card>
      )}

      {preview && <Card className="p-1 px-2">{preview}</Card>}
    </div>
  );
};
