import { settings } from "@/lib/settings";
import { Caption, ImageFile } from "@/lib/types"
import { useAtom } from "jotai/react";
import { useDatasetDirectory } from "./provider/dataset-directory-provider";
import { getFilenameWithoutExtension } from "@/lib/utils";
import { useState } from "react";
import { ImageEntity } from "@/lib/database/image-entity";
import { database } from "@/lib/database/database";
import { useDatabase } from "@/lib/database/database-provider";

export const useImageImporter = () => {
  const { setAutoBackupEnabled } = useDatabase()
  const [separator] = useAtom(settings.caption.separator);
  const { directoryHandle } = useDatasetDirectory();
  const [imported, setImported] = useState(false)

  const importImages = async (
    existingImages: ImageEntity[],
    imageFiles: ImageFile[]
  ) => {
    if (!directoryHandle || imported) {
      return
    }
    const imageDocs = await Promise.all(imageFiles.map(async (image): Promise<ImageEntity | null> => {
      const existingImage = existingImages.find(existingImage => existingImage.filename === image.name)
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

      if (caption) {
        return {
          id: image.name,
          filename: image.name,
          caption: caption.preview,
          captionParts: caption.parts
        }
      } else if (existingImage) {
        return existingImage
      } else {
        return {
          id: image.name,
          filename: image.name,
        }
      }
    }))

    await database.images.bulkPut(imageDocs.filter(doc => doc !== null))

    setImported(true)
    setAutoBackupEnabled(true)
    console.log("Imported images")
  }

  return { importImages, imported }
}