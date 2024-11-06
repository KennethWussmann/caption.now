import { settings } from "@/lib/settings";
import { Caption, ImageFile } from "@/lib/types"
import { useAtom } from "jotai/react";
import { useDatasetDirectory } from "./provider/dataset-directory-provider";
import { getFilenameWithoutExtension } from "@/lib/utils";
import { useState } from "react";
import { ImageEntity } from "@/lib/database/image-entity";
import { useDatabase } from "@/lib/database/database-provider";
import { Database } from "@/lib/database/database";
export type ImportCaptionConflictStrategy = "skip" | "replace";

export class ConflictError extends Error {
  constructor(public conflicts: CaptionFileConflict[]) {
    super("Conflicting files detected")
  }
}

export type CaptionFileConflict = {
  filename: string
  txtCaption: Caption
  dbCaption: ImageEntity
}

export const useImageImporter = () => {
  const { setAutoBackupEnabled, saveDatabaseBackup } = useDatabase()
  const [separator] = useAtom(settings.caption.separator);
  const { directoryHandle } = useDatasetDirectory();
  const [imported, setImported] = useState(false)

  const importImages = async (
    database: Database,
    existingImages: ImageEntity[],
    imageFiles: ImageFile[],
    conflictStrategy?: ImportCaptionConflictStrategy
  ) => {
    if (!directoryHandle || imported) {
      return
    }
    const conflicts: CaptionFileConflict[] = []
    const imageDocs = await Promise.all(imageFiles.map(async (image): Promise<ImageEntity | null> => {
      const existingImage = existingImages.find(existingImage => existingImage.filename === image.name)
      let caption: Caption | null = null
      const captionFilename = getFilenameWithoutExtension(image.name) + ".txt"
      try {
        const captionFileHandle = await directoryHandle.getFileHandle(captionFilename)
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

      const isConflict = existingImage?.caption && caption?.preview && existingImage.caption !== caption.preview

      if (isConflict && caption) {
        if (conflictStrategy === "replace") {
          return {
            id: image.name,
            filename: image.name,
            caption: caption.preview,
            captionParts: caption.parts
          }
        } else if (conflictStrategy === "skip") {
          return existingImage
        } else {
          conflicts.push({
            filename: captionFilename,
            txtCaption: caption,
            dbCaption: existingImage
          })
          return null
        }
      }

      if (caption) {
        return {
          id: image.name,
          filename: image.name,
          caption: caption.preview,
          captionParts: caption.parts
        }
      } else if (existingImage) {
        return null
      } else {
        return {
          id: image.name,
          filename: image.name,
        }
      }
    }))

    if (conflicts.length > 0) {
      throw new ConflictError(conflicts)
    }

    await database.images.bulkPut(imageDocs.filter(doc => doc !== null))

    setImported(true)
    console.log("Imported images")
    console.log("Saving backup")
    void saveDatabaseBackup()
    setAutoBackupEnabled(true)
  }

  return { importImages, imported }
}