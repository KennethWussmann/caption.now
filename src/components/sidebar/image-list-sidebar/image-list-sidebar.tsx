import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppSidebarHeader } from "../app-sidebar-header";
import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { ImageListItem } from "./image-list-item";
import { useImageCaption } from "@/lib/image-caption-provider";

export function ImageListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { imageFile } = useImageCaption();
  const { imageFiles } = useDatasetDirectory();

  // Ref to store references to each image item
  const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({});

  // Effect to scroll the active image into view when it changes
  React.useEffect(() => {
    if (imageFile && itemRefs.current[imageFile.name]) {
      itemRefs.current[imageFile.name]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [imageFile]);

  return (
    <Sidebar {...props}>
      <AppSidebarHeader>
        <div className="text-muted-foreground text-sm font-semibold ml-2 mt-2">
          Images
        </div>
      </AppSidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {imageFiles.map((img) => (
                <ImageListItem
                  key={img.name}
                  image={img}
                  ref={(el) => (itemRefs.current[img.name] = el)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
