import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { Progress } from "@/components/ui/progress"
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider"
import { CaptionFileConflict, ConflictError, ImportCaptionConflictStrategy, useImageImporter } from "@/hooks/use-image-importer"
import { useDatabase } from "@/lib/database/database-provider"
import { LoaderCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type LoadingStep = "dataset" | "database" | "import"

type LoadingDatasetViewProps = {
  onDone: VoidFunction
  onEmptyDataset: VoidFunction
  onConflict: (conflicts: CaptionFileConflict[]) => void
  directoryHandle: FileSystemDirectoryHandle,
  conflictStrategy?: ImportCaptionConflictStrategy
}

export const LoadingDatasetView = ({
  onDone,
  onEmptyDataset,
  onConflict,
  directoryHandle,
  conflictStrategy
}: LoadingDatasetViewProps) => {
  const { importImages } = useImageImporter()
  const { initializeDatabase } = useDatabase()
  const { loadDirectory } = useDatasetDirectory()
  const [step, setStep] = useState<LoadingStep>("dataset")
  const progress = step === "dataset" ? 10 : step === "database" ? 50 : 80

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) {
      return
    }
    hasInitialized.current = true

    const loadDataset = async () => {
      try {
        console.log("Loading directory")
        const imageFiles = await loadDirectory(directoryHandle)

        if (imageFiles.length === 0) {
          onEmptyDataset()
          return
        }

        console.log("Initializing database")
        setStep("database")
        const database = await initializeDatabase(directoryHandle)
        const existingImages = await database.images.toArray()

        console.log("Existing images in backup", existingImages.length)

        console.log("Importing images", imageFiles.length)
        setStep("import")
        try {
          await importImages(database, existingImages, imageFiles, conflictStrategy)
          onDone()
        } catch (error) {
          if (error instanceof ConflictError) {
            onConflict(error.conflicts)
          } else {
            throw error
          }
        }
      } catch (error) {
        console.error("Error during dataset loading:", error)
      }
    }

    loadDataset()
  }, [])

  return (
    <Alert className="border-blue-500">
      <LoaderCircle className="h-4 w-4 animate-spin" />
      <AlertTitle>
        {step === "dataset" && "Loading Dataset"}
        {step === "database" && "Initializing Database"}
        {step === "import" && "Importing Images"}
      </AlertTitle>
      <AlertDescription>
        Hang tight! We are loading your dataset. Depending on the size this might take a while.
        <Progress className="mt-2" value={progress} />
      </AlertDescription>
    </Alert>
  )
}