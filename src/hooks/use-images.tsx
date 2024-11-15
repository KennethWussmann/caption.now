import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useAction } from "./use-action";
import { isImageDone } from "@/lib/database/image-entity";
import { useLiveQuery } from "dexie-react-hooks";
import { useDatabase } from "@/lib/database/database-provider";

export const useImages = () => {
  const action = useAction()
  const [hideDone] = useAtom(settings.appearance.hideDoneImages)
  const { database } = useDatabase()

  const allImages = useLiveQuery(() => database.images.toArray())
  const doneImages = action && allImages ? allImages.filter(image => isImageDone(image, action)) : []
  const pendingImages = action && allImages ? allImages.filter(image => !isImageDone(image, action)) : []
  const donePercentage = allImages ? allImages.length === 0 ? 0 : Math.round(doneImages.length / allImages.length * 100) : 0
  const images = hideDone ? pendingImages : allImages

  return {
    images: images || [],
    doneImages,
    pendingImages,
    allImages: allImages || [],
    donePercentage
  };
};
