import { ReactNode } from "react";

export type SettingsNavbarItem = {
  name: string;
  icon: React.FC<{ className?: string }>;
  content: ReactNode;
};
