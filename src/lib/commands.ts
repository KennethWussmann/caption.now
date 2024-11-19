import { FC } from "react";
import { productName } from "./constants";
import { Shortcut } from "./settings";
import {
  ClipboardCopy,
  ClipboardPaste,
  ClipboardPlus,
  Command,
  Download,
  ImageDown,
  ImageUp,
  Save,
  Search,
  Settings,
  Trash,
} from "lucide-react";

export type CommandHandler = {
  shortcut: Shortcut;
  execute: () => void;
};

export type CommandDefinition = {
  icon: FC;
  title: string;
  description: string;
  category: CommandCategory;
};

export type Command = CommandHandler & CommandDefinition;
export type CommandCategory =
  | "General"
  | "Image"
  | "Export"
  | "Caption"
  | "Categories";

export const commandDefinitions: Record<Shortcut, CommandDefinition> = {
  openSettings: {
    icon: Settings,
    title: "Open settings",
    description: "Opens or closes this settings dialog",
    category: "General",
  },
  openCommandPalette: {
    icon: Command,
    title: "Open command palette",
    description: "Opens the command palette to search for commands",
    category: "General",
  },
  applySuggestionModifier: {
    icon: ClipboardPlus,
    title: "Apply AI suggestion modifier",
    description:
      "Configures the modifier key that should be pressed along a number key (1-9) to apply an AI caption part suggestion",
    category: "Caption",
  },
  saveCaption: {
    icon: Save,
    title: "Save caption",
    description: `${productName} saves automatically when necessary, but sometimes it just feels satisfying to mash that Save button.`,
    category: "Caption",
  },
  previousImage: {
    icon: ImageUp,
    title: "Previous image",
    description: "Load the previous image from the image sidebar",
    category: "Image",
  },
  nextImage: {
    icon: ImageDown,
    title: "Next image",
    description: "Load the next image from the image sidebar",
    category: "Image",
  },
  deleteImage: {
    icon: Trash,
    title: "Delete image",
    description: "Delete the currently open image",
    category: "Image",
  },
  startExport: {
    icon: Download,
    title: "Start export",
    description: "Immediately starts a new export",
    category: "Export",
  },
  clearCaption: {
    icon: Trash,
    title: "Clear current caption",
    description: "Removes the caption of the currently open image",
    category: "Caption",
  },
  copyCaptionParts: {
    icon: ClipboardCopy,
    title: "Copy caption parts",
    description:
      "Copies the currently open picture's caption parts into an internal clipboard",
    category: "Caption",
  },
  pasteCaptionParts: {
    icon: ClipboardPaste,
    title: "Paste caption parts",
    description:
      "Adds the caption parts on the internal clipboard into the currently open image's caption",
    category: "Caption",
  },
  searchCurrentCaption: {
    icon: Search,
    title: "Search in current caption",
    description:
      "Shows a search dialog to find text in the currently open caption",
    category: "Caption",
  },
  saveCategories: {
    icon: Save,
    title: "Save categories",
    description: "Save the current categories",
    category: "Categories",
  },
  clearCategories: {
    icon: Trash,
    title: "Clear categories",
    description: "Clear all categories",
    category: "Categories",
  },
};
const commandRegistry: Partial<Record<Shortcut, CommandHandler>> = {};

export const registerCommand = (handler: CommandHandler) => {
  commandRegistry[handler.shortcut] = handler;
};

export const getCommands = (): Command[] =>
  Object.values(commandRegistry).map((command) => ({
    ...command,
    ...commandDefinitions[command.shortcut],
  }));

export const getCategorizedCommands = (): Record<
  CommandCategory,
  Command[]
> => {
  const categorizedCommands: Record<CommandCategory, Command[]> = {
    General: [],
    Image: [],
    Export: [],
    Caption: [],
    Categories: [],
  };

  for (const command of getCommands()) {
    categorizedCommands[command.category].push(command);
  }

  return categorizedCommands;
};

export const getCommandDefinition = (shortcut: Shortcut): CommandDefinition => {
  return commandDefinitions[shortcut];
};
