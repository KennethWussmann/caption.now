import { Sparkles } from "lucide-react";
import { SettingsNavbarItem } from "../types";

const AISettingsContent = () => {
  return "AI settings content";
};

const navbarItem: SettingsNavbarItem = {
  name: "AI",
  icon: Sparkles,
  content: <AISettingsContent />,
};

export default navbarItem;
