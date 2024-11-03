import { useImages } from "@/hooks/use-images";
import { Check, FileText, Images } from "lucide-react";
import { Separator } from "../ui";
import { useExportProgress } from "./export-progress-provider";

export const ExportCaptionSummary = () => {
  const { images, doneImages, allDone } = useImages();
  const { progress: { percentage } } = useExportProgress();

  return (
    <div className="flex gap-4 flex-col">
      {doneImages.length > 0 ? (
        <div className="flex gap-4 items-center">
          <FileText className="h-12 w-12" />
          <div>
            {doneImages.length} Label{doneImages.length > 1 ? "s" : ""}
            <div className="text-xs text-muted-foreground">
              They will be named after the image they belong to and saved as .txt files in the same folder as the images
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <FileText className="h-8 w-8" />
          <div className="text-destructive">
            {doneImages.length} Labels
            <div className="text-xs text-destructive">
              Label at least one image to export
            </div>
          </div>
        </div>
      )}
      <Separator />
      <div className="flex gap-4 items-center">
        <Images className="h-8 w-8" />
        <div>
          {allDone ? "You labeled all images" : `You labeled ${doneImages.length} out of ${images.length} images`}
        </div>
      </div>
      {percentage === 100 && (<>
        <Separator />
        <div className="flex gap-4 items-center">
          <Check className="h-8 w-8" />
          Export successful
        </div>
      </>)}
    </div>
  );
};
