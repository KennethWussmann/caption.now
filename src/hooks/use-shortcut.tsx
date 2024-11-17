import { registerCommand } from "@/lib/commands";
import { settings, Shortcut } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useHotkeys } from "react-hotkeys-hook";

export const useShortcut = (settingsKey: Shortcut, callback: () => void) => {
  const [shortcut] = useAtom(settings.shortcuts[settingsKey]);
  registerCommand({
    shortcut: settingsKey,
    execute: callback,
  });
  useHotkeys(shortcut, callback, { enableOnFormTags: ["INPUT", "TEXTAREA"], preventDefault: true });
}