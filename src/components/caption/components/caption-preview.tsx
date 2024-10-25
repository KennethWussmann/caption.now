import { Card } from "@/components/ui";
import { useImageCaption } from "@/lib/image-caption-provider";
import { useMemo } from "react";

export const CaptionPreview = () => {
  const { caption } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
  const isEmpty = caption.parts.length === 0;

  if (isEmpty) {
    return (
      <Card className="p-1 px-2 italic text-muted-foreground text-center">
        No caption
      </Card>
    );
  }

  return <Card className="p-1 px-2 max-h-60 overflow-y-scroll">{text}</Card>;
};
