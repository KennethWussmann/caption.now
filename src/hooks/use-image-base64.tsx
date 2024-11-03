import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { ImageEntity } from "@/lib/database/image-entity";
import { useEffect, useState } from "react";

export const useImageBase64 = (image: ImageEntity | null | undefined) => {
  const { directoryHandle } = useDatasetDirectory();

  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    if (!directoryHandle) {
      return;
    }
    if (!image) {
      setBase64(null)
      return;
    }
    (async () => {
      const handle = await directoryHandle.getFileHandle(image.filename)
      const file = await handle.getFile()
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = (reader.result as string) || "";
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setBase64(base64)

    })()
  }, [directoryHandle, image, setBase64])
  return base64
}