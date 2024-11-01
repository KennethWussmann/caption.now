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
import { ImageListItem } from "./image-list-item";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";
import { useImages } from "@/hooks/use-images";

export function ImageListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { currentImage } = useImageNavigation();
  const { images } = useImages();
  const [hideDone, setHideDone] = useAtom(settings.appearance.hideDoneImages);

  // Ref to store references to each image item
  const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({});

  // Effect to scroll the active image into view when it changes
  React.useEffect(() => {
    if (currentImage && itemRefs.current[currentImage.filename]) {
      itemRefs.current[currentImage.filename]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentImage]);

  return (
    <Sidebar {...props}>
      <AppSidebarHeader>
        <div className="flex items-center justify-between text-muted-foreground text-sm font-semibold ml-2 mt-2">
          Images ({images.length})
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
                {images
                  .map((image) => (
                    <ImageListItem
                      key={image.id}
                      image={image}
                      ref={(el) => (itemRefs.current[image.filename] = el)}
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
