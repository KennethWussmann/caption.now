import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui"
import { FileQuestion, Image, ImageOff, Pencil, Tags } from "lucide-react"
import { ActionSelector } from "./action-selector"
import { ActionItem } from "./action-item"
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider"

export const SelectActionView = ({
  onCancel
}: {
  onCancel: VoidFunction
}) => {
  const {
    imageFiles,
    textFiles,
    failedImageFiles,
    failedTextFiles,
  } = useDatasetDirectory();

  return (
    <Card className="bg-transparent backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Let's Go!</CardTitle>
        <CardDescription>
          Your dataset was loaded successfully. You can start working with
          your images now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-2 items-center">
            <Image className="h-8 w-8" /> {imageFiles.length} Image
            {imageFiles.length !== 1 && "s"} with {textFiles.length} label
            {textFiles.length !== 1 && "s"}
          </div>
          {failedImageFiles > 0 && (
            <>
              <Separator />
              <div className="flex gap-2 items-center">
                <ImageOff className="h-8 w-8" />
                <div>
                  <div className="text-destructive">
                    {failedImageFiles} Unsupported image
                    {failedImageFiles !== 1 && "s"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Only JPEG, JPG and PNG are supported
                  </div>
                </div>
              </div>
            </>
          )}
          {failedTextFiles > 0 && (
            <>
              <Separator />
              <div className="flex gap-2 items-center">
                <FileQuestion className="h-8 w-8" />
                <div>
                  <div className="text-destructive">
                    {failedTextFiles} Label{failedTextFiles !== 1 && "s"}{" "}
                    failed to load
                  </div>
                  <div className="text-xs text-muted-foreground">
                    They are not named after an image
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
            <p className="mt-6 mb-4 text-center font-semibold">
              What do you want to do?
            </p>
            <ActionSelector>
              <ActionItem
                icon={Pencil}
                href="/caption"
                title="Caption"
                description="Write detailed captions for your images with the help of AI"
              />
              <ActionItem
                icon={Tags}
                href="/sort"
                title="Sort"
                description="Pre-screen your dataset, sort images into categories and export them into new datasets"
                soon
              />
            </ActionSelector>
          </div>
          <Separator />
          <Button variant="ghost" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}