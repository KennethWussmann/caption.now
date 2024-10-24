import { ThemeModeToggle } from "../theme/theme-mode-toggle";
import { SidebarHeader } from "../ui/sidebar";

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader>
      <ThemeModeToggle />
    </SidebarHeader>
  );
};
