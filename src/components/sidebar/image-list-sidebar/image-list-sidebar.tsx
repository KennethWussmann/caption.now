import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ImageListItem } from "./image-list-item";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";
import { useImages } from "@/hooks/use-images";
import { Progress } from "@/components/ui/progress";

export function ImageListSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { currentImage } = useImageNavigation();
  const { images, allImages, doneImages, donePercentage } = useImages();
  const [hideDone, setHideDone] = useAtom(settings.appearance.hideDoneImages);

  // Ref to store references to each image item
  const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({});

  // Effect to scroll the active image into view when it changes
  React.useEffect(() => {
    if (currentImage && itemRefs.current[currentImage.filename]) {
      itemRefs.current[currentImage.filename]?.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [currentImage]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 h-16 border-b flex align-middle justify-center">
        <div className="flex items-center justify-between text-muted-foreground text-sm font-semibold">
          Images ({donePercentage}%{` - ${doneImages.length}/${allImages.length}`})
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
        {donePercentage > 0 && (<Progress className="h-2" value={donePercentage} />)}
      </SidebarHeader>
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
