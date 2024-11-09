import { useImages } from "@/hooks/use-images";
import { FolderInput } from "lucide-react";
import { useExportProgress } from "../export-progress-provider";
import { ExportItem } from "../types";
import { unique } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExportSuccessfulSummaryMessage } from "./export-successful-summary-message";


const getDirectoriesCreated = (items: ExportItem[]): Record<string, number> => {
  const directoryCounts = items.reduce<Record<string, number>>((acc, { image: { categories = [] } }) => {
    const directoryName = unique(categories.map(category => category.text))
      .sort()
      .join(", ");

    acc[directoryName] = (acc[directoryName] || 0) + 1;
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(directoryCounts).sort(([, countA], [, countB]) => countB - countA)
  );
};



export const SortExportSummary = () => {
  const { allImages } = useImages();
  const { items, progress: { percentage } } = useExportProgress();
  const directoriesCreated = getDirectoriesCreated(items);
  const directoriesCreatedAmount = Object.keys(directoriesCreated).length;

  return (
    <div className="flex gap-4 flex-col">
      {directoriesCreatedAmount > 0 ? (
        <div className="flex gap-4 items-center">
          <FolderInput className="h-8 w-8" />
          <div>
            {directoriesCreatedAmount} Director{directoriesCreatedAmount > 1 ? "ies" : "y"} will be created
            <div className="text-xs text-muted-foreground">
              Image categories will be joined into directories and the images will be copied to their respective directories
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <FolderInput className="h-8 w-8" />
          <div className="text-destructive">
            {directoriesCreatedAmount} Directories
            <div className="text-xs text-destructive">
              Categorize at least one image to export
            </div>
          </div>
        </div>
      )}
      <Table>
        <TableCaption>You categorized {items.length} out of {allImages.length} images</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Directory</TableHead>
            <TableHead className="text-right">Images</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(directoriesCreated).map(([directory, amount]) => (
            <TableRow key={directory}>
              <TableCell>{directory}</TableCell>
              <TableCell className="text-right">{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {percentage === 100 && <ExportSuccessfulSummaryMessage />}
    </div>
  );
};
