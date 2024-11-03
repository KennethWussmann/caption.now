import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { addRxPlugin, createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { deleteAllIndexedDBs } from "../utils";
import { RxDBJsonDumpPlugin } from "rxdb/plugins/json-dump";
import {
  ImageCollection,
  imageDocMethods,
  imageSchema,
} from "./image-collection";
addRxPlugin(RxDBJsonDumpPlugin);

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
  deleteDatabaseBackup: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  isInitialized: boolean;
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
  const [isInitialized, setInitialized] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const saveDatabaseBackup = useCallback(
    async (localDb?: Database) => {
      const db = localDb ?? database;
      if (!db || !directoryHandle) {
        return;
      }
      setSaving(true);
      await writeTextFile(
        `.caption-now/database.json`,
        JSON.stringify(await db.exportJSON())
      );
      setSaving(false);
    },
    [database, directoryHandle, writeTextFile]
  );

  const initializeDatabase = useCallback(async () => {
    if (!directoryHandle || !isDirectoryLoaded || database || isInitialized) {
      return;
    }
    setIsLoading(true);

    await deleteAllIndexedDBs();

    try {
      const captionNowDir = await directoryHandle.getDirectoryHandle(
        ".caption-now",
        {
          create: true,
        }
      );

      const db: Database = await createRxDatabase({
        name: "caption-now",
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
      });

      await db.addCollections({
        images: { schema: imageSchema, methods: imageDocMethods },
      });

      const backupFileHandle = await captionNowDir.getFileHandle(
        `database.json`,
        {
          create: true,
        }
      );
      const backupFile = await backupFileHandle.getFile();
      const backupFileText = await backupFile.text();

      if (backupFileText) {
        await db.importJSON(JSON.parse(backupFileText));
      }

      setDatabase(db);
      setInitialized(true);
      console.log("Database initialized with collections");
      db.images.insert$.subscribe(() => {
        saveDatabaseBackup(db);
      });
      db.images.remove$.subscribe(() => {
        saveDatabaseBackup(db);
      });
      db.images.update$.subscribe(() => {
        saveDatabaseBackup(db);
      });
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      setIsLoading(false);
    }
  }, [directoryHandle, isDirectoryLoaded, database, saveDatabaseBackup, isInitialized]);

  const deleteDatabaseBackup = async () => {
    if (!directoryHandle) {
      return;
    }
    await directoryHandle.removeEntry(`.caption-now`, { recursive: true });
  }

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  useEffect(() => {
    return () => {
      if (database) database.destroy();
    };
  }, [database]);

  const value = {
    database,
    isLoading,
    isSaving,
    isInitialized,
    saveDatabaseBackup,
    deleteDatabaseBackup,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
