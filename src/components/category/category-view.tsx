import { useImageNavigation } from "@/hooks/provider/image-navigation-provider";
import { ImageViewer } from "../common/image-viewer";
import { CategoryInput } from "./components/category-input";
import { CategoryList } from "./components/category-list";

export const CategoryView = () => {
  const { currentImage } = useImageNavigation();
  if (!currentImage) {
    return null;
  }
  return (
    <div className="relative flex flex-col h-full gap-4">
      <div className="flex flex-grow">
        <div className="flex-grow w-full h-full flex items-center justify-center overflow-hidden">
          <ImageViewer image={currentImage} />
        </div>

        <div className="w-1/3 h-full flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <CategoryList />
          </div>
        </div>
      </div>
      <CategoryInput />
    </div>
  );
};
