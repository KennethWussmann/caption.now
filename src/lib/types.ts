import { z } from "zod";

export type DirectoryFile = {
  name: string;
  type: string;
};

export type ImageFile = DirectoryFile & {
  src: string;
  base64: string;
  captionFile?: TextFile;
};

export type TextFile = DirectoryFile & {
  content: string;
};

export type CaptionPart = {
  id: string;
  index: number;
  text: string;
};

export type Caption = {
  parts: CaptionPart[];
  preview?: string;
};

export const dexieBackupSchema = z
  .object({
    formatName: z.literal("dexie"),
    formatVersion: z.literal(1),
    data: z
      .object({
        databaseName: z.string(),
        databaseVersion: z.number(),
      })
      .passthrough(),
  })
  .passthrough();

export type DexieBackup = z.infer<typeof dexieBackupSchema>;
