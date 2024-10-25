import { Separator } from "@/components/ui";
import { SettingsDialog } from "../settings/settings-dialog";
import { ThemeModeToggle } from "../theme/theme-mode-toggle";
import { SidebarHeader } from "../ui/sidebar";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader>
      <div className="flex gap-2  h-12 p-2">
        <ThemeModeToggle />
        <SettingsDialog />
      </div>
    </SidebarHeader>
  );
};
