import Dexie from "dexie";
import { ImageEntity } from "./image-entity";

export const database = new Dexie("caption-now") as Dexie & {
  images: Dexie.Table<ImageEntity, "id">;
};
database.version(1).stores({
  images: "id, filename, tags, captionParts, caption",
});

export type Database = typeof database;

export const wipeDatabase = async () => {
  database.close();
  await database.delete();
  await database.open();
};
