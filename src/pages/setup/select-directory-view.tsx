import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import LogoShadow from "@/assets/logo-shadow.png"
import { FolderOpen, TriangleAlert } from "lucide-react"
import { UnsupportedBrowserAlert } from "./unsupported-browser-alert"
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider"

export const SelectDirectoryView = ({
  onSelected,
  isEmpty
}: {
  onSelected: (handle: FileSystemDirectoryHandle) => void
  isEmpty: boolean
}) => {
  const {
    supported,
    openDirectoryPicker,
    isAccessDenied,
  } = useDatasetDirectory();

  const handleSelectDirectory = async () => {
    const directoryHandle = await openDirectoryPicker()
    if (directoryHandle) {
      onSelected(directoryHandle)
    }
  }

  return (
    <>
      <img src={LogoShadow} alt="Logo" className="w-64 h-6w-64 mx-auto" draggable="false" />
      <Card className="bg-transparent backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>
            To start labeling your images, select a directory from your
            computer that contains all images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAccessDenied && (
            <Alert variant={"destructive"} className="mb-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Access Denied!</AlertTitle>
              <AlertDescription>
                Your browser denied access to select a directory. Please
                check your browser settings and reload the page.
              </AlertDescription>
            </Alert>
          )}

          {isEmpty && (
            <Alert variant={"destructive"} className="mb-4">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>No images found</AlertTitle>
              <AlertDescription>
                The directory you selected does not contain any images.
                Please select a different directory that contains JPEG, JPG
                or PNG files.
              </AlertDescription>
            </Alert>
          )}

          {supported ? (
            <Button className="w-full" onClick={handleSelectDirectory}>
              <FolderOpen /> Select Directory
            </Button>
          ) : <UnsupportedBrowserAlert />}
        </CardContent>
      </Card>
    </>
  )
}