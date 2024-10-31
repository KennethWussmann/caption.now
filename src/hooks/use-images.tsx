import { useDatabase } from "@/lib/database/database-provider";
import { ImageDocument, } from "@/lib/database/image-collection";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useAction } from "./use-action";

export const useImages = () => {
  const action = useAction()
  const [hideDone] = useAtom(settings.appearance.hideDoneImages)
  const { database } = useDatabase()

  const [images, setImages] = useState<ImageDocument[]>([])

  useEffect(() => {
    if (!database || !action) {
      return
    }
    const subscription = database.images.find().$.subscribe(results => {
      setImages(results.filter(image => hideDone ? !image.isDone(action) : true))
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [hideDone, database, action])

  return {
    images
  };
};
