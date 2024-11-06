import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";
import { productName } from "@/lib/constants";
import { ActionSelector } from "./action-selector";
import { ActionItem } from "./action-item";
import { Replace, SkipForward } from "lucide-react";
import { CaptionFileConflict, ImportCaptionConflictStrategy } from "@/hooks/use-image-importer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { truncateFilename } from "@/lib/utils";


export type ConflictViewProps = {
  conflicts: CaptionFileConflict[];
  onSelect: (strategy: ImportCaptionConflictStrategy) => void;
  onCancel: VoidFunction
};

export const ConflictView = ({ conflicts, onCancel, onSelect }: ConflictViewProps) => {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-2xl text-destructive">{conflicts.length} conflict{conflicts.length !== 1 && "s"} detected</CardTitle>
        <CardDescription>
          Your selected directory contains caption files that already exist in your {productName} database. What would you like to do?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>File Content</TableHead>
                <TableHead>Database</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conflicts.map((conflict) => (
                <TableRow key={conflict.filename}>
                  <TableCell>{truncateFilename(conflict.filename)}</TableCell>
                  <TableCell>{conflict.txtCaption.preview ?? ""}</TableCell>
                  <TableCell>{conflict.dbCaption.caption ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>


          <p className="mt-6 text-center font-semibold">
            What do you want to do?
          </p>
          <ActionSelector>
            <ActionItem
              icon={SkipForward}
              onClick={() => onSelect("skip")}
              title="Skip"
              description="Don't import the captions. The existing captions will be kept."
            />
            <ActionItem
              icon={Replace}
              onClick={() => onSelect("replace")}
              title="Replace"
              description="Replace the existing captions with the new ones from the text files. The old captions will be lost."
            />
          </ActionSelector>
          <Separator />
          <Button variant="ghost" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}