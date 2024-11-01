import { SettingsNavbarItem } from "../types";

import AppearanceSettings from "./appearance-settings/appearance-settings-content";
import ShortcutsSettings from "./shortcuts-settings/shortcuts-settings-content";
import AISettings from "./ai-settings/ai-settings-content";
import AdvancedSettings from "./advanced-settings/advanced-settings-content";
import CaptionSettings from "./caption-settings/caption-settings-content";

export const navbarItems: SettingsNavbarItem[] = [
  AppearanceSettings,
  ShortcutsSettings,
  CaptionSettings,
  AISettings,
  AdvancedSettings,
];
