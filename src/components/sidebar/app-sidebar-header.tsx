import { SettingsDialog } from "../settings/settings-dialog";
import { SidebarHeader } from "../ui/sidebar";
import { ReactNode } from "react";

export const AppSidebarHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <SidebarHeader>
      <div className="flex gap-2  h-12 p-2">
        <SettingsDialog />
      </div>
      {children}
    </SidebarHeader>
  );
};
