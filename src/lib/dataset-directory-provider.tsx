import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { ImageFile, TextFile } from "./types";

type DatasetDirectoryContextType = {
  supported: boolean;
  openDirectoryPicker: () => Promise<void>;
  isDirectorySelected: boolean;
  imageFiles: ImageFile[];
  textFiles: TextFile[];
  isDirectoryLoaded: boolean;
  isAccessDenied: boolean;
  isEmpty: boolean;
  reset: () => void;
  writeTextFile: (fileName: string, content: string) => Promise<void>;
  loadImage: (path: string) => Promise<ImageFile | null>;
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
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [textFiles, setTextFiles] = useState<TextFile[]>([]);
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

      const imageFiles: ImageFile[] = [];
      const textFiles: TextFile[] = [];

      for await (const entry of handle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile();
          const fileType = file.type;

          if (fileType.startsWith("image/")) {
            const src = URL.createObjectURL(file);
            imageFiles.push({
              name: file.name,
              type: fileType,
              src,
            });
          } else if (fileType === "text/plain") {
            const content = await file.text(); // Read file as text
            textFiles.push({
              name: file.name,
              type: fileType,
              content,
            });
          }
        }
      }

      setImageFiles(imageFiles.sort((a, b) => a.name.localeCompare(b.name)));
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
      await loadDirectory(dirHandle);
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

  const loadImage = useCallback(
    async (path: string): Promise<ImageFile | null> => {
      if (!directoryHandle) {
        throw new Error("No directory selected");
      }

      try {
        const fileHandle = await directoryHandle.getFileHandle(path);
        const file = await fileHandle.getFile();

        if (!file.type.startsWith("image/")) {
          console.error("File is not an image:", file.type);
          return null;
        }

        const src = URL.createObjectURL(file);

        return {
          name: file.name,
          type: file.type,
          src,
        };
      } catch (err) {
        console.error("Error loading image:", err);
        return null;
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
    loadImage,
  };

  return (
    <DatasetDirectoryContext.Provider value={value}>
      {children}
    </DatasetDirectoryContext.Provider>
  );
};
