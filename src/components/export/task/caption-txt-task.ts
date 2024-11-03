import { ExportTask } from "../types";

export const CaptionTxtTask: ExportTask = {
  type: "caption-txt",
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
