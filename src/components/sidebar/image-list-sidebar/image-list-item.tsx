import { Badge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui";
import { useImageCaption } from "@/lib/image-caption-provider";
import { ImageFile } from "@/lib/types";
import { Check } from "lucide-react";

export const ImageListItem = ({ image }: { image: ImageFile }) => {
  const { imageFile, setImageFile } = useImageCaption();
  return (
    <SidebarMenuItem>
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
            {image.name}
            <Badge variant="secondary" className="flex gap-1">
              <Check className="h-5 w-5" />
              Done
            </Badge>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
