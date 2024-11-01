import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ImageDocument } from "@/lib/database/image-collection";
import { useImages } from "../use-images";
import { useHotkeys } from "react-hotkeys-hook";
import { useDatabase } from "@/lib/database/database-provider";

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
  const { database } = useDatabase();
  const { images } = useImages();
  const [currentImageId, setCurrentImageId] = useState<string>();
  const [currentImage, setCurrentImage] = useState<ImageDocument>();
  const [hasNextImage, setHasNextImage] = useState(false);
  const [hasPreviousImage, setHasPreviousImage] = useState(false);

  const getHasNextImage = useCallback(() => {
    if (images.length === 0) {
      return false;
    }
    if (!currentImageId) {
      return images.length > 0;
    }
    const currentIndex = images.findIndex(
      (file) => currentImageId === file.id
    );
    return currentIndex < images.length - 1;
  }, [images, currentImageId]);

  const getHasPreviousImage = useCallback(() => {
    if (!currentImageId || images.length === 0) {
      return false;
    }
    const currentIndex = images.findIndex(
      (file) => currentImageId === file.id
    );
    return currentIndex > 0;
  }, [images, currentImageId]);

  const loadNextImage = useCallback(() => {
    if (!getHasNextImage()) return;
    if (!currentImageId) {
      setCurrentImageId(images[0].id);
      return;
    }
    const currentIndex = images.findIndex(
      (file) => currentImageId === file.id
    );
    if (currentIndex < images.length - 1) {
      setCurrentImageId(images[currentIndex + 1].id);
    }
  }, [getHasNextImage, images, currentImageId]);

  const loadPreviousImage = useCallback(() => {
    if (!getHasPreviousImage() || !currentImageId) return;
    const currentIndex = images.findIndex(
      (file) => currentImageId === file.id
    );
    if (currentIndex > 0) {
      setCurrentImageId(images[currentIndex - 1].id);
    }
  }, [getHasPreviousImage, images, currentImageId]);

  const selectImage = useCallback((filename: string) => {
    const image = images.find((image) => image.filename === filename);
    if (image) {
      setCurrentImageId(image.id);
    }
  }, [images]);

  useEffect(() => {
    setHasNextImage(getHasNextImage());
    setHasPreviousImage(getHasPreviousImage());
  }, [currentImageId, images, getHasNextImage, getHasPreviousImage]);

  useEffect(() => {
    if (!currentImageId || !database) {
      return;
    }
    const subscription = database.images.findOne(currentImageId).$.subscribe(
      (doc: ImageDocument | null) => {
        if (doc) {
          setCurrentImage(doc);
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    }
  }, [currentImageId, database]);


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