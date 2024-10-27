import { Lens } from "@/components/ui/lens";
import { ImageFile } from "@/lib/types";

export const ImageViewer = ({ image }: { image: ImageFile }) => {
  return (
    <div className="relative w-full h-full max-h-full flex justify-center items-center p-2">
      <Lens zoomFactor={3} lensSize={300}>
        <img
          src={image.src}
          className="max-w-full max-h-[calc(100vh-250px)] object-contain"
          alt={image.name}
        />
      </Lens>
    </div>
  );
};
