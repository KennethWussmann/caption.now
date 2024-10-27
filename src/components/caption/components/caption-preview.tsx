import { Card } from "@/components/ui";
import { useImageCaption } from "@/lib/image-caption-provider";
import { useMemo } from "react";

export const CaptionPreview = () => {
  const { caption } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
  const isEmpty = caption.parts.length === 0;

  return (
    <div className="my-2 py-2">
      <div className="flex flex-row gap-2 mb-2 font-semibold items-center">
        Preview
      </div>

      {isEmpty && (
        <Card className="p-1 px-2 italic text-muted-foreground text-center">
          No caption
        </Card>
      )}

      {!isEmpty && <Card className="p-1 px-2">{text}</Card>}
    </div>
  );
};
