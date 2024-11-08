import { CaptionPart, Category } from "../types";

export type ImageEntity = {
  id: string;
  filename: string;
  categories?: Category[];
  captionParts?: CaptionPart[];
  caption?: string;
};

export const isImageDone = (image: ImageEntity, action: "caption" | "sort") => {
  if (action === "caption") {
    return (
      (image.captionParts && image.captionParts.length > 0) ||
      (image.caption && image.caption.length > 0) ||
      false
    );
  } else if (action === "sort") {
    return (image.categories && image.categories.length > 0) || false;
  }
  return false;
};
