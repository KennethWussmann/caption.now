import { ImageDocument } from "@/lib/database/image-collection";

export type ExportType = "caption-txt" | "sort";
export type ExportItem = {
  image: ImageDocument;
  directoryHandle: FileSystemDirectoryHandle;
};

export type ExportTask = {
  type: ExportType;
  export: (item: ExportItem) => Promise<void>;
};
