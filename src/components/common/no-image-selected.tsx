import { Image, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle, Separator } from "../ui"

export const NoImageSelected = () => {

  return <div className="flex w-full h-full justify-center items-center align-middle">
    <div className="max-w-80 flex flex-col gap-6 items-center">
      <Image className="h-16 w-16" />
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">No image selected</h2>
        <p className="text-muted-foreground">Please select an image from the left to start editing</p>
      </div>
      <Separator />
      <Alert className="border-none">
        <Info className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Use your Page Up and Page Down keys to navigate between images.
        </AlertDescription>
      </Alert>
    </div>
  </div>
}