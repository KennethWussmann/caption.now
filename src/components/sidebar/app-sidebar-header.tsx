import { SettingsDialog } from "../settings/settings-dialog";
import { ThemeModeToggle } from "../theme/theme-mode-toggle";
import { SidebarHeader } from "../ui/sidebar";
import { ReactNode } from "react";

export const AppSidebarHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <SidebarHeader>
      <div className="flex gap-2  h-12 p-2">
        <ThemeModeToggle />
        <SettingsDialog />
      </div>
      {children}
    </SidebarHeader>
  );
};
