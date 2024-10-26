import { Paintbrush } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { ThemeSelector } from "../../../theme/theme-selector";

const AppearanceSettingsContent = () => {
  const [skipSetupSummary, setSkipSetupSummary] = useAtom(
    settings.appearance.skipSetupSummary
  );
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Theme</TableCell>
          <TableCell className="text-right">
            <ThemeSelector />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex flex-col gap-2">
              <div>Skip dataset summary</div>
              <div className="text-muted-foreground">
                After selecting your dataset directory, skip the summary that
                shows the number of images and existing captions.
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Switch
              checked={skipSetupSummary}
              onCheckedChange={setSkipSetupSummary}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "Appearance",
  icon: Paintbrush,
  content: <AppearanceSettingsContent />,
};

export default navbarItem;
