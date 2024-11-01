import { settings, Settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useHotkeys } from "react-hotkeys-hook";

export const useShortcut = (settingsKey: keyof Settings["shortcuts"], callback: () => void) => {
  const [shortcut] = useAtom(settings.shortcuts[settingsKey]);
  useHotkeys(shortcut, callback, { enableOnFormTags: ["INPUT", "TEXTAREA"], preventDefault: true });
}