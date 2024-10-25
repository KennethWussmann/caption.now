import { useImageCaption } from "@/lib/image-caption-provider";
import { CaptionInput } from "./components/caption-input";
import { CaptionList } from "./components/caption-list";
import { ImageViewer } from "./components/image-viewer";

export const CaptionView = () => {
  const { imageFile } = useImageCaption();
  if (!imageFile) {
    return null;
  }
  return (
    <div className="relative flex flex-col h-full gap-4">
      <div className="flex flex-grow">
        <div className="flex-grow w-full h-full flex items-center justify-center overflow-hidden">
          <ImageViewer image={imageFile} />
        </div>

        <div className="w-1/3 h-full flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <CaptionList />
          </div>
        </div>
      </div>
      <CaptionInput />
    </div>
  );
};
