import { Card } from "@/components/ui";
import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { useImageCaption } from "@/lib/image-caption-provider";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect } from "react";

export const CaptionPreview = () => {
  const { caption, imageFile } = useImageCaption();
  const { writeCaption } = useDatasetDirectory();
  const [separator] = useAtom(settings.caption.separator);
  const [endWithSeparator] = useAtom(settings.caption.endWithSeparator);

  let finalText = caption.parts
    .map((part) => part.text.trim())
    .join(separator)
    .trim();

  if (endWithSeparator && !finalText.endsWith(separator.trim())) {
    finalText += separator;
  }

  const isEmpty = caption.parts.length === 0;

  useEffect(() => {
    if (!imageFile || finalText.length < 3) {
      return;
    }
    writeCaption(finalText, imageFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText, writeCaption]);

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

      {!isEmpty && <Card className="p-1 px-2">{finalText}</Card>}
    </div>
  );
};
