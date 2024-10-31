import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ImageDocument } from "@/lib/database/image-collection";
import { useImages } from "../use-images";
import { useHotkeys } from "react-hotkeys-hook";

interface ImageNavigationContextType {
  currentImage?: ImageDocument;
  hasNextImage: boolean;
  hasPreviousImage: boolean;
  selectImage: (filename: string) => void;
  loadNextImage: () => void;
  loadPreviousImage: () => void;
}

const ImageNavigationContext = createContext<ImageNavigationContextType | undefined>(undefined);

export const ImageNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { images } = useImages();
  const [currentImage, setCurrentImage] = useState<ImageDocument>();
  const [hasNextImage, setHasNextImage] = useState(false);
  const [hasPreviousImage, setHasPreviousImage] = useState(false);

  const getHasNextImage = useCallback(() => {
    if (images.length === 0) {
      return false;
    }
    if (!currentImage) {
      return images.length > 0;
    }
    const currentIndex = images.findIndex(
      (file) => currentImage.filename === file.filename
    );
    return currentIndex < images.length - 1;
  }, [images, currentImage]);

  const getHasPreviousImage = useCallback(() => {
    if (!currentImage || images.length === 0) {
      return false;
    }
    const currentIndex = images.findIndex(
      (file) => currentImage.filename === file.filename
    );
    return currentIndex > 0;
  }, [images, currentImage]);

  const loadNextImage = useCallback(() => {
    if (!getHasNextImage()) return;
    if (!currentImage) {
      setCurrentImage(images[0]);
      return;
    }
    const currentIndex = images.findIndex(
      (file) => currentImage.filename === file.filename
    );
    if (currentIndex < images.length - 1) {
      setCurrentImage(images[currentIndex + 1]);
    }
  }, [getHasNextImage, images, currentImage]);

  const loadPreviousImage = useCallback(() => {
    if (!getHasPreviousImage() || !currentImage) return;
    const currentIndex = images.findIndex(
      (file) => currentImage.filename === file.filename
    );
    if (currentIndex > 0) {
      setCurrentImage(images[currentIndex - 1]);
    }
  }, [getHasPreviousImage, images, currentImage]);

  const selectImage = useCallback((filename: string) => {
    const image = images.find((image) => image.filename === filename);
    if (image) {
      setCurrentImage(image);
    }
  }, [images]);

  useEffect(() => {
    setHasNextImage(getHasNextImage());
    setHasPreviousImage(getHasPreviousImage());
  }, [currentImage, images, getHasNextImage, getHasPreviousImage]);

  return (
    <ImageNavigationContext.Provider value={{
      currentImage,
      selectImage,
      hasNextImage,
      hasPreviousImage,
      loadNextImage,
      loadPreviousImage
    }}>
      {children}
    </ImageNavigationContext.Provider>
  );
};

export const useImageNavigation = (): ImageNavigationContextType => {
  const context = useContext(ImageNavigationContext);
  if (!context) {
    throw new Error("useImageNavigation must be used within an ImageNavigationProvider");
  }
  return context;
};


export const useImageNavigationHotkeys = () => {
  const { loadNextImage, loadPreviousImage } = useImageNavigation();
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
