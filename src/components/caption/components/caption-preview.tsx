import { Card } from "@/components/ui";
import { useImageCaption } from "@/lib/image-caption-provider";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useMemo } from "react";

export const CaptionPreview = () => {
  const { caption } = useImageCaption();
  const [separator] = useAtom(settings.caption.separator);
  const [endWithSeparator] = useAtom(settings.caption.endWithSeparator);
  const text = useMemo(
    () =>
      (
        caption.parts.map((part) => part.text.trim()).join(separator) +
        (endWithSeparator ? separator : "")
      ).trim(),
    [caption.parts, endWithSeparator, separator]
  );
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
