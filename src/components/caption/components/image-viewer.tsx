import { ImageFile } from "@/lib/types";

export const ImageViewer = ({ image }: { image: ImageFile }) => {
  return (
    <div className="relative w-full h-full max-h-full flex justify-center items-center p-2">
      <img
        src={image.src}
        className="max-w-full max-h-full object-contain"
        alt={image.name}
      />
    </div>
  );
};
