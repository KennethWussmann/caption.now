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
  const [doneImages, setDoneImages] = useState<ImageDocument[]>([])
  const [pendingImages, setPendingImages] = useState<ImageDocument[]>([])
  const [allImages, setAllImages] = useState<ImageDocument[]>([])
  const [allDone, setAllDone] = useState(false)
  const [donePercentage, setDonePercentage] = useState(0)

  useEffect(() => {
    if (!database || !action) {
      return
    }
    const subscription = database.images.find().$.subscribe(results => {
      const done = results.filter(image => image.isDone(action))
      const pending = results.filter(image => !image.isDone(action))
      setDoneImages(done)
      setPendingImages(pendingImages)
      setAllImages(results)
      setImages(hideDone ? pending : results)
      setAllDone(done.length === results.length)
      setDonePercentage(results.length === 0 ? 0 : done.length / results.length * 100)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [hideDone, database, action, pendingImages])

  return {
    images,
    doneImages,
    pendingImages,
    allImages,
    allDone,
    donePercentage
  };
};
