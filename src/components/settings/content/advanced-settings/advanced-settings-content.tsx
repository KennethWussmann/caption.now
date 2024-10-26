import { Wrench } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui";
import { resetLocalStorage } from "@/lib/settings";

const AdvancedSettingsContent = () => {
  const resetSettings = async () => {
    await resetLocalStorage();
    window.location.reload();
  };
  
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Reset all settings</div>
              <div className="text-muted-foreground">
                Warning! This cannot be undone. The page will reload after
                reset, so be sure to save any changes to your dataset before
                proceeding.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button variant={"destructive"} onClick={resetSettings}>
              Reset
            </Button>
          </TableCell>
        </TableRow>
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
