import { isImageDone } from "@/lib/database/image-entity";
import { ExportTask } from "../types";
import { unique } from "@/lib/utils";

export const SortTask: ExportTask = {
  description: "Sort your images into directories based on their categories.",
  filter: ({ image }) => isImageDone(image, "sort"),
  export: async ({ image, directoryHandle }) => {
    if (!image.categories) {
      return;
    }

    try {
      const sourceFileHandle = await directoryHandle.getFileHandle(
        image.filename,
        { create: false }
      );
      const sourceStream = (await sourceFileHandle.getFile()).stream();

      const categoryDirectoryName = unique(
        image.categories.map(({ text }) => text)
      )
        .sort()
        .join(", ");
      const destinationDirectoryHandle =
        await directoryHandle.getDirectoryHandle(categoryDirectoryName, {
          create: true,
        });
      const destinationFileHandle =
        await destinationDirectoryHandle.getFileHandle(image.filename, {
          create: true,
        });
      const destinationStream = await destinationFileHandle.createWritable();

      await sourceStream.pipeTo(destinationStream);

      await destinationStream.close();
    } catch {
      //
    }
  },
};
