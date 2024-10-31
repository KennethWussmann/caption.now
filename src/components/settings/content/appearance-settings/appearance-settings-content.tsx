import { Paintbrush } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { ThemeSelector } from "../../../theme/theme-selector";

const AppearanceSettingsContent = () => {
  const [disableAnimations, setDisableAnimations] = useAtom(
    settings.appearance.disableAnimations
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
          <TableCell>Disable animations</TableCell>
          <TableCell className="text-right">
            <Switch
              checked={disableAnimations}
              onCheckedChange={setDisableAnimations}
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
