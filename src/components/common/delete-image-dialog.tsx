import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, DialogFooter } from "../ui";
import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";
import { Checkbox } from "../ui/checkbox";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { useHotkeys } from "react-hotkeys-hook";
import { useDatabase } from "@/lib/database/database-provider";
import { useToast } from "@/hooks/use-toast";
import { useShortcut } from "@/hooks/use-shortcut";


export const DeleteImageDialog = () => {
  const { currentImage, loadNextImage, loadPreviousImage, hasNextImage, hasPreviousImage } = useImageNavigation();
  const { imageFiles, deleteFile } = useDatasetDirectory();
  const imageFile = useMemo(() =>
    imageFiles.find((file) => file.name === currentImage?.filename),
    [currentImage, imageFiles]
  );
  const [isOpen, setOpen] = useState(false);
  const [deleteCaptionFile, setDeleteCaptionFile] = useState(true);
  const { database } = useDatabase();
  const { toast } = useToast()

  useHotkeys("enter", () => {
    if (isOpen) {
      handleConfirm();
    }
  })
  useShortcut("deleteImage", () => {
    if (currentImage) {
      setOpen(true);
    }
  })

  const handleConfirm = async () => {
    setOpen(false);
    if (!imageFile) {
      return;
    }
    if (hasNextImage) {
      loadNextImage();
    } else if (hasPreviousImage) {
      loadPreviousImage();
    }
    await deleteFile(imageFile);
    if (deleteCaptionFile && imageFile.captionFile) {
      await deleteFile(imageFile.captionFile);
    }

    await database.images.where("id").equals(imageFile.name).delete();

    toast({
      title: "Image deleted",
      description: `Image ${imageFile.name} has been deleted`,
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete image?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <b>{currentImage?.filename}</b>? This will remove the file from your computer and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {imageFile?.captionFile && (
          <div className="items-top flex space-x-2">
            <Checkbox id="deleteCaptionFile" checked={deleteCaptionFile} onCheckedChange={checked => setDeleteCaptionFile(typeof checked === "boolean" ? checked : false)} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="deleteCaptionFile"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Delete caption file as well
              </label>
              <p className="text-sm text-muted-foreground">
                There is a .txt file associated with this image. Do you want to delete it as well?
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <div className="flex flex-row gap-4 justify-between">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
