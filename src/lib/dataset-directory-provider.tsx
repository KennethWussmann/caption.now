import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

type DirectoryFile = {
  name: string;
  type: string;
  content?: string | ArrayBuffer | null;
};

type DatasetDirectoryContextType = {
  supported: boolean;
  openDirectoryPicker: () => Promise<void>;
  isDirectorySelected: boolean;
  imageFiles: DirectoryFile[];
  textFiles: DirectoryFile[];
  isDirectoryLoaded: boolean;
  isAccessDenied: boolean;
  isEmpty: boolean;
  reset: () => void;
  writeTextFile: (fileName: string, content: string) => Promise<void>;
};

const DatasetDirectoryContext = createContext<
  DatasetDirectoryContextType | undefined
>(undefined);

export const useDatasetDirectory = () => {
  const context = useContext(DatasetDirectoryContext);
  if (!context) {
    throw new Error(
      "useDatasetDirectory must be used within DatasetDirectoryProvider"
    );
  }
  return context;
};

export const DatasetDirectoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isAccessDenied, setAccessDenied] = useState(false);
  const [isDirectorySelected, setIsDirectorySelected] = useState(false);
  const [isDirectoryLoaded, setDirectoryLoaded] = useState(false);
  const [imageFiles, setImageFiles] = useState<DirectoryFile[]>([]);
  const [textFiles, setTextFiles] = useState<DirectoryFile[]>([]);
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const supported = "showDirectoryPicker" in window;

  const resetState = useCallback(() => {
    setIsDirectorySelected(false);
    setDirectoryLoaded(false);
    setImageFiles([]);
    setTextFiles([]);
    setDirectoryHandle(null);
    setAccessDenied(false);
  }, []);

  const loadDirectory = useCallback(
    async (handle: FileSystemDirectoryHandle) => {
      setDirectoryLoaded(false);
      setImageFiles([]);
      setTextFiles([]);

      const files: DirectoryFile[] = [];
      for await (const entry of handle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile();
          const fileContent = await file.text(); // Read file as text
          const fileType = file.type;

          if (fileType.startsWith("image/") || fileType === "text/plain") {
            files.push({
              name: file.name,
              type: fileType,
              content: fileContent,
            });
          }
        }
      }

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      const textFiles = files.filter((file) => file.type === "text/plain");

      setImageFiles(imageFiles);
      setTextFiles(textFiles);
      setDirectoryLoaded(true);
    },
    []
  );

  const openDirectoryPicker = useCallback(async () => {
    if (!supported || !window.showDirectoryPicker) {
      throw new Error("Directory picker not supported");
    }
    setDirectoryLoaded(false);
    setIsDirectorySelected(false);
    try {
      const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
      setDirectoryHandle(dirHandle);
      setIsDirectorySelected(true);
      loadDirectory(dirHandle);
    } catch (err) {
      console.error("Error opening directory:", err);
      resetState();
      setAccessDenied(true);
    }
  }, [supported, loadDirectory, resetState]);

  const writeTextFile = useCallback(
    async (fileName: string, content: string) => {
      if (!directoryHandle) {
        throw new Error("No directory selected");
      }

      try {
        const fileHandle = await directoryHandle.getFileHandle(fileName, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      } catch (err) {
        console.error("Error writing file:", err);
        throw new Error("Failed to write file");
      }
    },
    [directoryHandle]
  );

  // Effect to monitor permission status
  useEffect(() => {
    const checkPermission = async () => {
      if (!directoryHandle) return;

      const permissionStatus = await directoryHandle.queryPermission({
        mode: "readwrite",
      });
      if (permissionStatus === "denied" || permissionStatus === "prompt") {
        resetState();
      }
    };

    checkPermission();

    const intervalId = setInterval(checkPermission, 1000);
    return () => clearInterval(intervalId);
  }, [directoryHandle, resetState]);

  const value = {
    supported,
    openDirectoryPicker,
    isDirectorySelected,
    isDirectoryLoaded,
    imageFiles,
    textFiles,
    isAccessDenied,
    isEmpty: imageFiles.length === 0,
    reset: resetState,
    writeTextFile,
  };

  return (
    <DatasetDirectoryContext.Provider value={value}>
      {children}
    </DatasetDirectoryContext.Provider>
  );
};
