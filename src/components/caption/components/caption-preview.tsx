import { Card } from "@/components/ui";
import { useCaptionEditor } from "@/hooks/provider/caption-editor-provider";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const CaptionPreview = () => {
  const { parts } = useCaptionEditor();
  const [separator] = useAtom(settings.caption.separator);
  const [endWithSeparator] = useAtom(settings.caption.endWithSeparator);

  let finalText = parts
    .map((part) => part.text.trim())
    .join(separator)
    .trim();

  if (endWithSeparator && !finalText.endsWith(separator.trim())) {
    finalText += separator;
  }

  const isEmpty = parts.length === 0;

  // TODO: Dont write caption to file, but to the database and then export from there to file
  // useEffect(() => {
  //   if (!imageFile || finalText.length < 3) {
  //     return;
  //   }
  //   writeCaption(finalText, imageFile);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [finalText, writeCaption]);

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
