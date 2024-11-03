import { ImageEntity } from "@/lib/database/image-entity";

export type ExportType = "caption-txt" | "sort";
export type ExportItem = {
  image: ImageEntity;
  directoryHandle: FileSystemDirectoryHandle;
};

export type ExportTask = {
  type: ExportType;
  export: (item: ExportItem) => Promise<void>;
};
