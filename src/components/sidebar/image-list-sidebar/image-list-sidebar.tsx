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
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";

export function ImageListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { imageFile } = useImageCaption();
  const { imageFiles } = useDatasetDirectory();
  const [hideDone, setHideDone] = useAtom(settings.appearance.hideDoneImages);

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
        <div className="flex items-center justify-between text-muted-foreground text-sm font-semibold ml-2 mt-2">
          Images
          <div className="flex items-center gap-2">
            <Checkbox
              id="hideDone"
              checked={hideDone}
              onCheckedChange={(checked) =>
                setHideDone(typeof checked === "boolean" ? checked : false)
              }
            />
            <label
              htmlFor="hideDone"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Hide done
            </label>
          </div>
        </div>
      </AppSidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <AnimatedGroup preset="blur-slide">
                {imageFiles
                  .filter((image) =>
                    hideDone
                      ? !image.captionFile ||
                        image.captionFile.content.length === 0
                      : true
                  )
                  .map((img) => (
                    <ImageListItem
                      key={img.name}
                      image={img}
                      ref={(el) => (itemRefs.current[img.name] = el)}
                    />
                  ))}
              </AnimatedGroup>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
