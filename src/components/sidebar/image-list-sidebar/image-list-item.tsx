import * as React from "react";
import { Badge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui";
import { Check } from "lucide-react";
import { truncateFilename } from "@/lib/utils";
import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";
import { useImageSrc } from "@/hooks/use-image-src";
import { ImageSkeleton } from "@/components/common/image-skeleton";
import { useAction } from "@/hooks/use-action";
import { ImageEntity, isImageDone } from "@/lib/database/image-entity";

export const ImageListItem = React.forwardRef<
  HTMLLIElement,
  { image: ImageEntity }
>(({ image }, ref) => {
  const action = useAction()
  const { selectImage, currentImage } = useImageNavigation();
  const src = useImageSrc(image);

  return (
    <SidebarMenuItem ref={ref}>
      <SidebarMenuButton
        asChild
        className="h-25 cursor-pointer"
        onClick={() => selectImage(image.filename)}
        isActive={currentImage?.id === image?.id}
      >
        <div className="flex flex-row gap-2">
          <ImageSkeleton
            src={src}
            alt={image.filename}
            className="max-h-20 max-w-20 object-cover rounded-sm"
          />
          <div className="flex flex-col gap-1 items-start">
            {truncateFilename(image.filename, 20)}
            {action && isImageDone(image, action) && (
              <Badge variant="secondary" className="flex gap-1">
                <Check className="h-5 w-5" />
                Done
              </Badge>
            )}
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});
