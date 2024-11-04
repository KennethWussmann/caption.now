import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { Progress } from "@/components/ui/progress"
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider"
import { useImageImporter } from "@/hooks/use-image-importer"
import { database } from "@/lib/database/database"
import { useDatabase } from "@/lib/database/database-provider"
import { LoaderCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type LoadingStep = "dataset" | "database" | "import"

export const LoadingDatasetView = ({ onDone, onEmptyDataset, directoryHandle }: { onDone: VoidFunction, onEmptyDataset: VoidFunction, directoryHandle: FileSystemDirectoryHandle }) => {
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
        await initializeDatabase(directoryHandle)
        const existingImages = await database.images.toArray()

        console.log("Existing images in backup", existingImages.length)

        console.log("Importing images", imageFiles.length)
        setStep("import")
        await importImages(existingImages, imageFiles)

        onDone()
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