import { CaptionInput } from "./components/caption-input";
import { CaptionList } from "./components/caption-list";
import { ImageViewer } from "./components/image-viewer";

export const CaptionView = () => {
  return (
    <div className="relative flex flex-col h-full gap-4">
      <div className="flex flex-grow">
        <div className="flex-grow flex items-center justify-center overflow-hidden">
          <ImageViewer />
        </div>

        <div className="w-2/4 h-full flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <CaptionList />
          </div>
        </div>
      </div>
      <CaptionInput />
    </div>
  );
};
