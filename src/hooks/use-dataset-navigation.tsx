import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { useImageCaption } from "@/lib/image-caption-provider";
import { useHotkeys } from "react-hotkeys-hook";

export const useDatasetNavigation = () => {
  const { imageFile, setImageFile } = useImageCaption();
  const { imageFiles } = useDatasetDirectory();

  const hasNextImage = () => {
    if (imageFiles.length === 0) {
      return false;
    }
    if (!imageFile) {
      return imageFiles.length > 0;
    }
    const currentIndex = imageFiles.indexOf(imageFile);
    return currentIndex < imageFiles.length - 1;
  };

  const hasPreviousImage = () => {
    if (!imageFile || imageFiles.length === 0) {
      return false;
    }
    const currentIndex = imageFiles.indexOf(imageFile);
    return currentIndex > 0;
  };

  const loadNextImage = () => {
    if (!hasNextImage()) {
      return;
    }
    if (!imageFile) {
      setImageFile(imageFiles[0]);
      return;
    }
    const currentIndex = imageFiles.indexOf(imageFile);
    if (currentIndex < imageFiles.length - 1) {
      setImageFile(imageFiles[currentIndex + 1]);
    }
  };

  const loadPreviousImage = () => {
    if (!hasPreviousImage() || !imageFile) {
      return;
    }
    const currentIndex = imageFiles.indexOf(imageFile);
    if (currentIndex > 0) {
      setImageFile(imageFiles[currentIndex - 1]);
    }
  };

  return {
    hasNextImage,
    hasPreviousImage,
    loadNextImage,
    loadPreviousImage,
  };
};

export const useDatasetNavigationHotkeys = () => {
  const { loadNextImage, loadPreviousImage } = useDatasetNavigation();
  useHotkeys(
    "pagedown",
    () => {
      loadNextImage();
    },
    { enableOnFormTags: ["INPUT"], preventDefault: true }
  );
  useHotkeys(
    "pageup",
    () => {
      loadPreviousImage();
    },
    { enableOnFormTags: ["INPUT"], preventDefault: true }
  );
};
