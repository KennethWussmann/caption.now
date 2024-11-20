import { useShortcut } from "@/hooks/use-shortcut";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "../ui";
import { Command, getCategorizedCommands } from "@/lib/commands";
import { Shortcut } from "@/lib/settings";
import { ShortcutText } from "../common/shortcut-text";
import { useImages } from "@/hooks/use-images";
import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";

const hiddenCommands: Shortcut[] = ["openCommandPalette"];

export const CommandPalette = () => {
  const [isOpen, setOpen] = useState(false);
  const commands = getCategorizedCommands();
  const { allImages } = useImages();
  const { selectImage } = useImageNavigation()
  useShortcut("openCommandPalette", () => {
    setOpen((current) => !current);
  })

  const executeCommand = (command: Command) => {
    setOpen(false);
    command.execute();
  }

  const onSelectImage = (filename: string) => {
    setOpen(false);
    selectImage(filename);
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search for image..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(commands).map(([category, commands]) => commands.length > 0 ? (
          <CommandGroup key={category} heading={category}>
            {commands.filter(
              command => !hiddenCommands.includes(command.shortcut)
            ).map(command => (
              <CommandItem key={command.shortcut} onSelect={() => executeCommand(command)}>
                <command.icon />
                <span>{command.title}</span>
                <CommandShortcut><ShortcutText settingsKey={command.shortcut} /></CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : <></>)}
        {allImages.length > 0 && (
          <CommandGroup heading="Images">
            {allImages.map(image => (
              <CommandItem key={image.id} onSelect={() => onSelectImage(image.filename)}>
                <span>{image.filename}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}