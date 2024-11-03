import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { ImageEntity } from "@/lib/database/image-entity";
import { useEffect, useState } from "react";

export const useImageSrc = (image: ImageEntity) => {
  const { directoryHandle } = useDatasetDirectory();

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!directoryHandle) {
      return;
    }
    (async () => {
      const handle = await directoryHandle.getFileHandle(image.filename)
      const file = await handle.getFile()
      setSrc(URL.createObjectURL(file))
    })()
  }, [directoryHandle, image, setSrc])
  return src
}