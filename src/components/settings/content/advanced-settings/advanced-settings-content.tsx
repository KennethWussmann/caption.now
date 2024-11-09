import { Wrench } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui";
import { resetLocalStorage } from "@/lib/settings";
import { productName } from "@/lib/constants";
import { useDatabase } from "@/lib/database/database-provider";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteAllIndexedDBs } from "@/lib/utils";
import { DoubleConfirmationDialog } from "@/components/common/double-confirmation-dialog";
import { DownloadSettingsRow } from "./download-settings-row";
import { ImportSettingsRow } from "./import-settings-row";

const AdvancedSettingsContent = () => {
  const { deleteAllTextFiles } = useDatasetDirectory();
  const { deleteDatabaseBackup } = useDatabase();
  const [isDeletingAllTextFiles, setDeletingAllTextFiles] = useState(false);
  const { toast } = useToast();

  const deleteTextFiles = async () => {
    setDeletingAllTextFiles(true);
    await deleteAllTextFiles();
    setDeletingAllTextFiles(false);
    toast({
      title: "All text files deleted",
    })
  }

  const reloadWithWarning = async (title: string) => {
    toast({
      title,
      description: "The page will reload now!",
    })
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.reload();
  }

  const deleteDatabase = async () => {
    await deleteDatabaseBackup();
    await deleteAllIndexedDBs();
    await reloadWithWarning("Database deleted");
  }

  const resetSettings = async () => {
    resetLocalStorage();
    await reloadWithWarning("Settings reset");
  };

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Reset all settings</div>
              <div className="text-muted-foreground">
                Warning! This cannot be undone. This will reset all settings of {productName} to the defaults. Your data and all labels is NOT affected. The page will reload after
                reset, so be sure to save any changes to your dataset before
                proceeding.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <DoubleConfirmationDialog message="This cannot be undone! All your settings will be removed.">
              <Button variant={"destructive"} onClick={resetSettings}>
                Reset
              </Button>
            </DoubleConfirmationDialog>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Delete {productName} database</div>
              <div className="text-muted-foreground">
                Warning! This cannot be undone. {productName} writes an internal database to your selected directory (at ./.caption-now/database.json). This database will be deleted and cannot be recovered. It contains all your labels about the currently open dataset. After the deletion, the page will refresh.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <DoubleConfirmationDialog message={`This cannot be undone! All your labels data you entered via ${productName} will be lost if you didn't export them!`}>
              <Button variant={"destructive"} onClick={deleteDatabase}>
                Permanently delete database
              </Button>
            </DoubleConfirmationDialog>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Delete all text files in dataset</div>
              <div className="text-muted-foreground">
                Warning! This cannot be undone. This will remove all files in your selected dataset directory that have the file extension .txt. This will not affect any other files in the directory.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <DoubleConfirmationDialog title="Are you sure?" message="This cannot be undone. This will remove all files in your selected dataset directory that have the file extension .txt. This will not affect any other files in the directory.">
              <Button variant={"destructive"} onClick={deleteTextFiles} disabled={isDeletingAllTextFiles}>
                Permanently delete text files
              </Button>
            </DoubleConfirmationDialog>
          </TableCell>
        </TableRow>
        <DownloadSettingsRow />
        <ImportSettingsRow onImportCompleted={() => reloadWithWarning("Settings imported")} />
      </TableBody>
    </Table>
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "Advanced",
  icon: Wrench,
  content: <AdvancedSettingsContent />,
};

export default navbarItem;
