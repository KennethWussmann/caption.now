import { useDatabase } from "@/lib/database/database-provider";
import { settings } from "@/lib/settings";
import { Caption, ImageFile } from "@/lib/types"
import { useAtom } from "jotai/react";
import { useDatasetDirectory } from "./provider/dataset-directory-provider";
import { getFilenameWithoutExtension } from "@/lib/utils";
import { ImageDocTypeUpsert } from "@/lib/database/image-collection";
import { useState } from "react";
import { useImages } from "./use-images";

export const useImageImporter = () => {
  const [separator] = useAtom(settings.caption.separator);
  const { directoryHandle } = useDatasetDirectory();
  const { database } = useDatabase()
  const { allImages } = useImages()
  const [imported, setImported] = useState(false)

  const importImages = (imageFiles: ImageFile[]) => {
    if (!database || !directoryHandle || imported) {
      return
    }
    (async () => {
      const imageDocs = await Promise.all(imageFiles.map(async (image): Promise<ImageDocTypeUpsert | null> => {
        const existingImage = allImages.find(existingImage => existingImage.filename === image.name)
        let caption: Caption | null = null
        try {
          const captionFileHandle = await directoryHandle.getFileHandle(getFilenameWithoutExtension(image.name) + ".txt")
          const file = await captionFileHandle.getFile()
          const captionText = await file.text()

          if (captionText && captionText.trim().length > 0) {
            caption = {
              parts: (captionText.split(separator).map(part => part.trim()) || []).filter(part => part.length > 0).map((text, index) => ({ id: index.toString(), text, index })),
              preview: captionText
            }
          }
        } catch {
          // No caption file
        }

        return {
          ...existingImage,
          filename: image.name,
          caption: caption?.preview ?? undefined,
          captionParts: caption?.parts ?? undefined
        }
      }))

      database.images.bulkUpsert(imageDocs.filter(doc => doc !== null) as ImageDocTypeUpsert[])
      setImported(true)
      console.log("Imported images")
    })()
  }

  return { importImages, imported }
}