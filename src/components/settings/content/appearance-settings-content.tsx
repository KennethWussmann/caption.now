import { Paintbrush } from "lucide-react";
import { SettingsNavbarItem } from "../types";

const AppearanceSettingsContent = () => {
  return "Appearance settings content";
};

const navbarItem: SettingsNavbarItem = {
  name: "Appearance",
  icon: Paintbrush,
  content: <AppearanceSettingsContent />,
};

export default navbarItem;
