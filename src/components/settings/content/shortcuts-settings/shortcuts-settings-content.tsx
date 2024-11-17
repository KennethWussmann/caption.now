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
        <ShortcutRow settingsKey="saveCaption" title="Save caption" description={`${productName} saves automatically when necessary, but sometimes it just feels satisfying to mash that Save button.`} />
        <ShortcutRow settingsKey="previousImage" title="Previous image" description="Load the previous image from the image sidebar" />
        <ShortcutRow settingsKey="nextImage" title="Next image" description="Load the next image from the image sidebar" />
        <ShortcutRow settingsKey="startExport" title="Start export" description="Immediately starts a new export" />
        <ShortcutRow settingsKey="clearCaption" title="Clear current caption" description="Removes the caption of the currently open image" />
        <ShortcutRow settingsKey="copyCaptionParts" title="Copy caption parts" description="Copies the currently open picture's caption parts into an internal clipboard" />
        <ShortcutRow settingsKey="pasteCaptionParts" title="Paste caption parts" description="Adds the caption parts on the internal clipboard into the currently open image's caption" />
        <ShortcutRow settingsKey="searchCurrentCaption" title="Search in current caption" description="Shows a search dialog to find text in the currently open caption" />
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
