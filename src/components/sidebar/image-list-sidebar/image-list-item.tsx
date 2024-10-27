import * as React from "react";
import { Badge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui";
import { useImageCaption } from "@/lib/image-caption-provider";
import { ImageFile } from "@/lib/types";
import { Check } from "lucide-react";
import { truncateFilename } from "@/lib/utils";

export const ImageListItem = React.forwardRef<
  HTMLLIElement,
  { image: ImageFile }
>(({ image }, ref) => {
  const { imageFile, setImageFile } = useImageCaption();

  return (
    <SidebarMenuItem ref={ref}>
      <SidebarMenuButton
        asChild
        className="h-25 cursor-pointer"
        onClick={() => setImageFile(image)}
        isActive={imageFile?.name === image.name}
      >
        <div className="flex flex-row gap-2">
          <img
            src={image.src}
            alt={image.name}
            className="max-h-20 max-w-20 object-cover rounded-sm"
          />
          <div className="flex flex-col gap-1 items-start">
            {truncateFilename(image.name, 20)}
            {image?.captionFile && image.captionFile.content.length > 0 && (
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
