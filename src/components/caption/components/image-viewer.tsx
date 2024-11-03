import { ImageSkeleton } from "@/components/common/image-skeleton";
import { Lens } from "@/components/ui/lens";
import { useImageSrc } from "@/hooks/use-image-src";
import { ImageEntity } from "@/lib/database/image-entity";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const ImageViewer = ({ image }: { image: ImageEntity }) => {
  const src = useImageSrc(image);
  const [lensEnabled] = useAtom(settings.tools.lens.enabled);
  const [zoomFactor] = useAtom(settings.tools.lens.zoomFactor);
  const [size] = useAtom(settings.tools.lens.size);

  return (
    <div className="relative w-full h-full max-h-full flex justify-center items-center p-2">
      <Lens zoomFactor={zoomFactor} lensSize={size} disabled={!lensEnabled}>
        <ImageSkeleton
          src={src}
          className="max-w-full max-h-[calc(100vh-250px)] object-contain"
          alt={image.filename}
        />
      </Lens>
    </div>
  );
};
