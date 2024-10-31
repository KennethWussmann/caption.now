import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createRxDatabase,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDatabase,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxCollection } from "rxdb";
import { useDatasetDirectory } from "./dataset-directory-provider";
import { Provider } from "rxdb-hooks";
import { deleteAllIndexedDBs } from "./utils";

const imageSchemaLiteral = {
  version: 0,
  type: "object",
  primaryKey: {
    key: "id",
    fields: ["filename"],
    separator: "|",
  },
  properties: {
    id: { type: "string" },
    filename: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["id", "filename", "tags"],
} as const;
const imageSchemaTyped = toTypedRxJsonSchema(imageSchemaLiteral);

export type ImageDoc = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof imageSchemaTyped
>;
export type ImageDocUpsert = Omit<ImageDoc, "id">;
const imageSchema: RxJsonSchema<ImageDoc> = imageSchemaTyped;

export type ImageCollection = RxCollection<ImageDoc>;

export type DatabaseCollections = {
  images: ImageCollection;
};
export type Database = RxDatabase<DatabaseCollections>;

export const collections = {
  images: "images",
} as const;

type DatabaseContextType = {
  database: Database | null;
  saveDatabaseBackup: () => Promise<void>;
  isLoading: boolean;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within DatabaseProvider");
  }
  return context;
};

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const { directoryHandle, writeTextFile, isDirectoryLoaded } =
    useDatasetDirectory();
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeDatabase = useCallback(async () => {
    if (!directoryHandle || !isDirectoryLoaded || database) return;

    await deleteAllIndexedDBs();

    setIsLoading(true);

    try {
      const captionNowDir = await directoryHandle.getDirectoryHandle(
        ".caption-now",
        {
          create: true,
        }
      );

      const db: Database = await createRxDatabase({
        name: "caption-now-sorting",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
      });

      await db.addCollections({
        images: { schema: imageSchema },
      });

      // Load each collection's backup if available
      for (const collectionKey of Object.keys(collections)) {
        const backupFile = await captionNowDir.getFileHandle(
          `${collectionKey}.json`,
          { create: true }
        );
        const file = await backupFile.getFile();
        const text = await file.text();

        if (text) {
          console.log(`Removed existing data from ${collectionKey}`);
        }

        const collectionData = text ? JSON.parse(text) : [];
        const collection: RxCollection =
          db.collections[collectionKey as keyof DatabaseCollections];
        await collection.bulkInsert(collectionData);
      }

      setDatabase(db);
      console.log("Database initialized with collections");
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      setIsLoading(false);
    }
  }, [directoryHandle, isDirectoryLoaded, database]);

  const saveDatabaseBackup = useCallback(async () => {
    if (!database || !directoryHandle) return;

    try {
      for (const collectionKey of Object.keys(collections)) {
        const collection =
          database.collections[collectionKey as keyof DatabaseCollections];
        const data = await collection.find().exec();
        const jsonData = JSON.stringify(data);

        await writeTextFile(`.caption-now/${collectionKey}.json`, jsonData);
      }
      console.log("Saved all collections to file system");
    } catch (error) {
      console.error("Error saving database backup:", error);
    }
  }, [database, directoryHandle, writeTextFile]);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  useEffect(() => {
    return () => {
      if (database) database.destroy();
    };
  }, [database]);

  const value = { database, isLoading, saveDatabaseBackup };

  return (
    <DatabaseContext.Provider value={value}>
      {value.database && (
        <Provider db={value.database ?? undefined}>{children}</Provider>
      )}
    </DatabaseContext.Provider>
  );
};
