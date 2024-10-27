import { Lens } from "@/components/ui/lens";
import { settings } from "@/lib/settings";
import { ImageFile } from "@/lib/types";
import { useAtom } from "jotai/react";

export const ImageViewer = ({ image }: { image: ImageFile }) => {
  const [lensEnabled] = useAtom(settings.tools.lens.enabled);
  const [zoomFactor] = useAtom(settings.tools.lens.zoomFactor);
  const [size] = useAtom(settings.tools.lens.size);

  return (
    <div className="relative w-full h-full max-h-full flex justify-center items-center p-2">
      <Lens zoomFactor={zoomFactor} lensSize={size} disabled={!lensEnabled}>
        <img
          src={image.src}
          className="max-w-full max-h-[calc(100vh-250px)] object-contain"
          alt={image.name}
        />
      </Lens>
    </div>
  );
};
