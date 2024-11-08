import { isImageDone } from "@/lib/database/image-entity";
import { ExportTask } from "../types";

export const CaptionTxtTask: ExportTask = {
  description:
    "Export your captions as plain text files, one per image and named after the image.",
  filter: ({ image }) => isImageDone(image, "caption"),
  export: async ({ image, directoryHandle }) => {
    const caption = image.caption ?? "";
    const baseName = image.filename.replace(/\.(jpg|jpeg|png)$/i, "");
    const fileName = `${baseName}.txt`;

    try {
      await directoryHandle.getFileHandle(fileName, { create: true });
      const writable = await directoryHandle.getFileHandle(fileName, {
        create: false,
      });
      const writableStream = await writable.createWritable();
      await writableStream.write(caption);
      await writableStream.close();
    } catch {
      //
    }
  },
};
