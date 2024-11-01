import { ImageDocument } from "@/lib/database/image-collection";
import { useDatasetDirectory } from "./provider/dataset-directory-provider";
import { useEffect, useState } from "react";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { Caption } from "@/lib/types";
import { getFilenameWithoutExtension } from "@/lib/utils";

export const useCaptionFile = (image: ImageDocument | null | undefined) => {
  const [separator] = useAtom(settings.caption.separator);
  const { directoryHandle } = useDatasetDirectory();
  const [caption, setCaption] = useState<Caption | null>(null);

  useEffect(() => {
    if (!directoryHandle) {
      return;
    }
    if (!image) {
      setCaption(null)
      return
    }
    (async () => {
      const handle = await directoryHandle.getFileHandle(getFilenameWithoutExtension(image.filename) + ".txt")
      const file = await handle.getFile()
      const caption = await file.text()
      if (!caption || caption.trim().length === 0) {
        setCaption(null)
        return
      }
      setCaption({
        parts: (caption.split(separator).map(part => part.trim()) || []).filter(part => part.length > 0).map((text, index) => ({ id: index.toString(), text, index })),
        preview: caption
      })
    })()
  }, [directoryHandle, image, separator, setCaption]);

  return caption
}