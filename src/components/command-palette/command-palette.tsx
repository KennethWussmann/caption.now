import { useShortcut } from "@/hooks/use-shortcut";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "../ui";
import { Command, getCategorizedCommands } from "@/lib/commands";
import { Shortcut } from "@/lib/settings";
import { ShortcutText } from "../common/shortcut-text";

const hiddenCommands: Shortcut[] = ["openCommandPalette"];

export const CommandPalette = () => {
  const [isOpen, setOpen] = useState(false);
  const commands = getCategorizedCommands();
  useShortcut("openCommandPalette", () => {
    setOpen((current) => !current);
  })

  const executeCommand = (command: Command) => {
    setOpen(false);
    command.execute();
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(commands).map(([category, commands]) => (
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
        ))}
      </CommandList>
    </CommandDialog>
  )
}