import { Keyboard } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody } from "@/components/ui/table";
import { ShortcutRow } from "./shortcut-row";
import { commandDefinitions } from "@/lib/commands";
import { Shortcut } from "@/lib/settings";

const ShortcutsSettingsContent = () => {
  return (
    <Table>
      <TableBody>
        {Object.entries(commandDefinitions).map(([key, { title, description }]) => (
          <ShortcutRow key={key} settingsKey={key as Shortcut} title={title} description={description} />
        ))}
      </TableBody>
    </Table >
  );
};

const navbarItem: SettingsNavbarItem = {
  name: "Shortcuts",
  icon: Keyboard,
  content: <ShortcutsSettingsContent />,
};

export default navbarItem;
