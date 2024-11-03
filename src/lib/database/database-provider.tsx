import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDatasetDirectory } from "@/hooks/provider/dataset-directory-provider";
import { deleteAllIndexedDBs, tryJSONParse } from "../utils";
import { database, Database } from "./database";
import { importDB, exportDB, } from "dexie-export-import";

type DatabaseContextType = {
  deleteDatabaseBackup: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  isInitialized: boolean;
  isAutoBackupEnabled: boolean;
  setAutoBackupEnabled: (enabled: boolean) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isAutoBackupEnabled, setAutoBackupEnabled] = useState(false);

  const saveDatabaseBackup = useCallback(
    async (localDb?: Database) => {
      console.log("Starting database backup")
      const db = localDb ?? database;
      if (!db || !directoryHandle) {
        return;
      }
      setSaving(true);

      const blob = await exportDB(db, {
        noTransaction: true,
      });
      const str = await blob.text();
      await writeTextFile(
        `.caption-now/database.json`,
        str
      );
      setSaving(false);
    },
    [directoryHandle, writeTextFile]
  );

  const initializeDatabase = useCallback(async () => {
    if (!directoryHandle || !isDirectoryLoaded || isInitialized) {
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
      try {
        const backupFileHandle = await captionNowDir.getFileHandle(
          `database.json`,
          {
            create: true,
          }
        );
        const backupFile = await backupFileHandle.getFile();
        const backupFileText = tryJSONParse(await backupFile.text());
        const isDexieExport = backupFileText?.formatName === "dexie"

        if (isDexieExport) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Importing existing database");
          await importDB(backupFile);
        } else {
          console.error("Unsupported database backup format", backupFileText);
        }
      } catch (e) {
        console.error("Failed to import existing database", e);
      }

      setInitialized(true);
      console.log("Database initialized with collections");
    } catch (error) {
      console.error("Error initializing database:", error);
    } finally {
      setIsLoading(false);
    }
  }, [directoryHandle, isDirectoryLoaded, isInitialized]);

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
    if (!isAutoBackupEnabled) {
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
  }, [isAutoBackupEnabled, saveDatabaseBackup])

  const value = {
    isLoading,
    isSaving,
    isInitialized,
    deleteDatabaseBackup,
    isAutoBackupEnabled,
    setAutoBackupEnabled,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
