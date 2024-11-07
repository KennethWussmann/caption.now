import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { tryJSONParse, uuid } from "../utils";
import { Database } from "./database";
import { exportDB, importDB, } from "dexie-export-import";
import Dexie from "dexie";
import { DexieBackup, dexieBackupSchema } from "../types";

type DatabaseContextType = {
  database: Database;
  deleteDatabaseBackup: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  isInitialized: boolean;
  isAutoBackupEnabled: boolean;
  setAutoBackupEnabled: (enabled: boolean) => void;
  initializeDatabase: (handle: FileSystemDirectoryHandle) => Promise<Database>;
  saveDatabaseBackup: (localDb?: Database) => Promise<void>;
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
  const { directoryHandle, writeTextFile } =
    useDatasetDirectory();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isAutoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [database, setDatabase] = useState<Database | null>(null);

  const saveDatabaseBackup = useCallback(
    async (localDb?: Database) => {
      if (!database) {
        return;
      }
      console.log("Starting database backup")
      const db = localDb ?? database;
      if (!db || !directoryHandle) {
        return;
      }
      setSaving(true);

      const blob = await exportDB(db, {
        noTransaction: true,
        prettyJson: true,
      });
      const str = await blob.text();
      await writeTextFile(
        `.caption-now/database.json`,
        str
      );
      setSaving(false);
    },
    [directoryHandle, writeTextFile, database]
  );

  const loadDexieBackup = async (directoryHandle: FileSystemDirectoryHandle): Promise<{ backup: DexieBackup, file: Blob } | null> => {
    try {
      const captionNowDir = await directoryHandle.getDirectoryHandle(
        ".caption-now",
        {
          create: true,
        }
      );
      try {
        const backupFileHandle = await captionNowDir.getFileHandle(
          `database.json`,
          {
            create: true,
          }
        );
        const backupFile = await backupFileHandle.getFile();
        const backupFileText = tryJSONParse(await backupFile.text());
        const dexieBackupParse = dexieBackupSchema.safeParse(backupFileText);

        if (dexieBackupParse.success) {
          return {
            backup: dexieBackupParse.data,
            file: backupFile,
          };
        } else {
          console.error("Unsupported database backup format", backupFileText, dexieBackupParse.error);
        }
      } catch (e) {
        console.error("Failed to import existing database", e);
      }
      console.log("Database initialized with collections");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
    return null
  }

  const deleteExistingDatabase = async (name: string) => {
    const databases = await indexedDB.databases();
    const db = databases.find((db) => db.name === name);
    if (db) {
      console.log("Deleting existing database", db.name);
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(db.name!);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  const importExistingDatabase = async (directoryHandle: FileSystemDirectoryHandle): Promise<Database | null> => {
    const db: Database | null = null;
    const backupFile = await loadDexieBackup(directoryHandle);

    if (backupFile) {
      await deleteExistingDatabase(backupFile.backup.data.databaseName);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      return await importDB(backupFile.file) as Database
    }
    return db
  }

  const createNewDatabase = () => {
    const database = new Dexie(`caption-now-${uuid()}`) as Database;
    database.version(1).stores({
      images: "id, filename, tags, captionParts, caption",
    });

    return database
  }

  const initializeDatabase = async (directoryHandle: FileSystemDirectoryHandle) => {
    setIsLoading(true);
    setInitialized(false);

    let db = await importExistingDatabase(directoryHandle);

    if (!db) {
      db = createNewDatabase();
    }

    setDatabase(db);
    setInitialized(true);
    setIsLoading(false);
    return db
  };

  const deleteDatabaseBackup = async () => {
    if (!directoryHandle) {
      return;
    }
    await directoryHandle.removeEntry(`.caption-now`, { recursive: true });
  }

  useEffect(() => {
    if (!isAutoBackupEnabled || !database) {
      return
    }

    const listener = () => {
      saveDatabaseBackup();
    };

    database.images.hook("creating", listener)
    database.images.hook("updating", listener)
    database.images.hook("deleting", listener)

    return () => {
      database.images.hook("creating").unsubscribe(listener)
      database.images.hook("updating").unsubscribe(listener)
      database.images.hook("deleting").unsubscribe(listener)
    }
  }, [isAutoBackupEnabled, saveDatabaseBackup, database])

  const value = {
    isLoading,
    isSaving,
    isInitialized,
    deleteDatabaseBackup,
    isAutoBackupEnabled,
    setAutoBackupEnabled,
    initializeDatabase,
    saveDatabaseBackup,
    database: database!
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
