import { useDatasetDirectory } from "@/lib/dataset-directory-provider";
import { useImageCaption } from "@/lib/image-caption-provider";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const useDatasetNavigation = () => {
  const { imageFile, setImageFile } = useImageCaption();
  const { imageFiles } = useDatasetDirectory();
  const [hideDone] = useAtom(settings.appearance.hideDoneImages);

  const [hasNextImage, setHasNextImage] = useState(false);
  const [hasPreviousImage, setHasPreviousImage] = useState(false);

  const filteredImageFiles = imageFiles.filter((image) =>
    hideDone
      ? !image.captionFile || image.captionFile.content.length === 0
      : true
  );

  const getHasNextImage = useCallback(() => {
    if (filteredImageFiles.length === 0) {
      return false;
    }
    if (!imageFile) {
      return filteredImageFiles.length > 0;
    }
    const currentIndex = filteredImageFiles.findIndex(
      (file) => imageFile.name === file.name
    );
    return currentIndex < filteredImageFiles.length - 1;
  }, [filteredImageFiles, imageFile]);

  const getHasPreviousImage = useCallback(() => {
    if (!imageFile || filteredImageFiles.length === 0) {
      return false;
    }
    const currentIndex = filteredImageFiles.findIndex(
      (file) => imageFile.name === file.name
    );
    return currentIndex > 0;
  }, [filteredImageFiles, imageFile]);

  const loadNextImage = () => {
    if (!getHasNextImage()) {
      return;
    }
    if (!imageFile) {
      setImageFile(filteredImageFiles[0]);
      return;
    }
    const currentIndex = filteredImageFiles.findIndex(
      (file) => imageFile.name === file.name
    );
    if (currentIndex < filteredImageFiles.length - 1) {
      setImageFile(filteredImageFiles[currentIndex + 1]);
    }
  };

  const loadPreviousImage = () => {
    if (!getHasPreviousImage() || !imageFile) {
      return;
    }
    const currentIndex = filteredImageFiles.findIndex(
      (file) => imageFile.name === file.name
    );
    if (currentIndex > 0) {
      setImageFile(filteredImageFiles[currentIndex - 1]);
    }
  };

  useEffect(() => {
    setHasNextImage(getHasNextImage());
    setHasPreviousImage(getHasPreviousImage());
  }, [imageFile, filteredImageFiles, getHasNextImage, getHasPreviousImage]);

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
