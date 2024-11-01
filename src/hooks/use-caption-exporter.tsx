import { useDatabase } from "@/lib/database/database-provider"
import { useEffect } from "react"
import { useDatasetDirectory } from "./provider/dataset-directory-provider"
import { getFilenameWithoutExtension } from "@/lib/utils"

export const useCaptionExporter = () => {
  const { writeTextFile } = useDatasetDirectory()
  const { database } = useDatabase()

  useEffect(() => {
    if (!database) {
      return
    }
    const subscription = database.images.update$.subscribe(({ documentData }) => {
      if (!documentData.caption) {
        return
      }
      writeTextFile(getFilenameWithoutExtension(documentData.filename) + ".txt", documentData.caption)
      console.log("Exported caption for", documentData.filename)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [database, writeTextFile])
}