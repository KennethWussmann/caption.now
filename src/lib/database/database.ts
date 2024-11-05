import Dexie from "dexie";
import { ImageEntity } from "./image-entity";

export type Database = Dexie & {
  images: Dexie.Table<ImageEntity, "id">;
};
