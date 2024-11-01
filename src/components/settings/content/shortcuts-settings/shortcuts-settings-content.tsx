import { Keyboard } from "lucide-react";
import { SettingsNavbarItem } from "../../types";
import { Table, TableBody } from "@/components/ui/table";
import { ShortcutRow } from "./shortcut-row";
import { productName } from "@/lib/constants";

const ShortcutsSettingsContent = () => {
  return (
    <Table>
      <TableBody>
        <ShortcutRow settingsKey="openSettings" title="Open settings" description="Opens or closes this settings dialog" />
        <ShortcutRow settingsKey="applySuggestionModifier" title="Apply AI suggestion modifier" description="Configures the modifier key that should be pressed along a number key (1-9) to apply an AI caption part suggestion" />
        <ShortcutRow settingsKey="save" title="Save" description={`${productName} saves automatically when necessary, but sometimes it just feels satisfying to mash that Save button.`} />
        <ShortcutRow settingsKey="previousImage" title="Previous image" description="Load the previous image from the image sidebar" />
        <ShortcutRow settingsKey="nextImage" title="Next image" description="Load the next image from the image sidebar" />
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
