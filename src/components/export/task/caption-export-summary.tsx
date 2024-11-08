import { useImages } from "@/hooks/use-images";
import { Check, FileText, Images } from "lucide-react";
import { Separator } from "../../ui";
import { useExportProgress } from "../export-progress-provider";

export const CaptionExportSummary = () => {
  const { allImages } = useImages();
  const { items, progress: { percentage } } = useExportProgress();

  return (
    <div className="flex gap-4 flex-col">
      {items.length > 0 ? (
        <div className="flex gap-4 items-center">
          <FileText className="h-12 w-12" />
          <div>
            {items.length} Label{items.length > 1 ? "s" : ""}
            <div className="text-xs text-muted-foreground">
              They will be named after the image they belong to and saved as .txt files in the same folder as the images
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <FileText className="h-8 w-8" />
          <div className="text-destructive">
            {items.length} Labels
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
          You labeled {items.length} out of {allImages.length} images
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
