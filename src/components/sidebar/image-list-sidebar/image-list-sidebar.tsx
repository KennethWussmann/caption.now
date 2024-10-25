import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "../app-sidebar-header";
import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { ImageListItem } from "./image-list-item";

export function ImageListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { imageFiles } = useDatasetDirectory();
  return (
    <Sidebar {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Images</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {imageFiles.map((imageFile) => (
                <ImageListItem key={imageFile.name} image={imageFile} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
