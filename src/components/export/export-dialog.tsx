import { useState } from "react";
import { Button, Dialog, DialogFooter, DialogHeader } from "@/components/ui";
import { DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui";
import { Check, Download, LoaderCircle } from "lucide-react";
import { ExportCaptionSummary } from "./export-caption-summary";
import { ExportProgress } from "./export-progress";
import { useExportProgress } from "./export-progress-provider";
import clsx from "clsx";
import { useImages } from "@/hooks/use-images";

export const ExportDialog = () => {
  const [open, setOpen] = useState(false);
  const { doneImages } = useImages()
  const { startExport, isExporting, isDone } = useExportProgress();
  const canExport = doneImages.length > 0;

  const handleExport = () => {
    startExport();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={clsx("w-full", { "animate-pulse": isExporting })}>
          {isExporting ? <LoaderCircle className="animate-spin" /> : isDone ? <Check /> : <Download />}
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>
            Export your labels as plain text files.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <ExportCaptionSummary />
          {isExporting && <ExportProgress />}

        </div>

        <DialogFooter>
          <div className="flex flex-row gap-4 justify-between">
            {isExporting && (
              <div className="text-muted-foreground text-sm">
                You can close this dialog while the export is running and we will let you know, once it's completed.
              </div>
            )}
            <Button onClick={handleExport} disabled={isExporting || !canExport}>
              {isExporting ?
                <>
                  <LoaderCircle className="animate-spin" />
                  Exporting
                </> :
                <>
                  <Download />
                  Export
                </>
              }
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
