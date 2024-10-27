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
  failedImageFiles: number;
  failedTextFiles: number;
  isDirectoryLoaded: boolean;
  isAccessDenied: boolean;
  isEmpty: boolean;
  reset: () => void;
  writeTextFile: (fileName: string, content: string) => Promise<void>;
  loadImage: (path: string) => Promise<ImageFile | null>;
  writeCaption: (caption: string, image: ImageFile) => Promise<void>;
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
  const [failedImageFiles, setFailedImageFiles] = useState(0);
  const [failedTextFiles, setFailedTextFiles] = useState(0);
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const supported = "showDirectoryPicker" in window;

  const resetState = useCallback(() => {
    setIsDirectorySelected(false);
    setDirectoryLoaded(false);
    setImageFiles([]);
    setFailedImageFiles(0);
    setFailedTextFiles(0);
    setDirectoryHandle(null);
    setAccessDenied(false);
  }, []);

  const loadDirectory = useCallback(
    async (handle: FileSystemDirectoryHandle) => {
      setDirectoryLoaded(false);
      setImageFiles([]);
      setFailedImageFiles(0);
      setFailedTextFiles(0);

      const imageFiles: ImageFile[] = [];
      const textFilesMap: Map<string, TextFile> = new Map();

      let failedImagesCount = 0;
      let orphanTextFilesCount = 0;

      for await (const entry of handle.values()) {
        if (entry.kind === "file") {
          const file = await entry.getFile();
          const fileType = file.type;
          const fileName = file.name;

          if (
            fileType.startsWith("image/") &&
            /\.(jpg|jpeg|png)$/i.test(fileName)
          ) {
            const src = URL.createObjectURL(file);

            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = (reader.result as string) || "";
                resolve(result.split(",")[1]);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });

            imageFiles.push({
              name: file.name,
              type: fileType,
              src,
              base64,
            });
          } else if (fileType === "text/plain" && /\.txt$/i.test(fileName)) {
            const content = await file.text();
            textFilesMap.set(fileName.replace(/\.txt$/i, ""), {
              name: file.name,
              type: fileType,
              content,
            });
          } else if (fileType.startsWith("image/")) {
            failedImagesCount++;
          }
        }
      }

      const finalImageFiles = imageFiles.map((imageFile) => {
        const baseName = imageFile.name.replace(/\.(jpg|jpeg|png)$/i, "");
        const captionFile = textFilesMap.get(baseName);
        if (captionFile) {
          textFilesMap.delete(baseName); // matched, so remove from map
        }
        return {
          ...imageFile,
          captionFile,
        };
      });

      orphanTextFilesCount = textFilesMap.size;

      setImageFiles(finalImageFiles);
      setFailedImageFiles(failedImagesCount);
      setFailedTextFiles(orphanTextFilesCount);
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

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = (reader.result as string) || "";
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        return {
          name: file.name,
          type: file.type,
          src,
          base64,
        };
      } catch (err) {
        console.error("Error loading image:", err);
        return null;
      }
    },
    [directoryHandle]
  );

  const writeCaption = useCallback(
    async (caption: string, image: ImageFile) => {
      if (!directoryHandle) {
        throw new Error("No directory selected");
      }

      const baseName = image.name.replace(/\.(jpg|jpeg|png)$/i, "");
      const fileName = `${baseName}.txt`;

      try {
        await writeTextFile(fileName, caption);
        const updatedImageFile = {
          ...image,
          captionFile: {
            name: fileName,
            type: "text/plain",
            content: caption,
          },
        };
        setImageFiles((prev) =>
          prev.map((file) =>
            file.name === image.name ? updatedImageFile : file
          )
        );
      } catch (err) {
        console.error("Error setting caption:", err);
        throw new Error("Failed to set caption");
      }
    },
    [directoryHandle, writeTextFile]
  );

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
    textFiles: imageFiles
      .map((image) => image.captionFile)
      .filter((text): text is TextFile => !!text),
    failedImageFiles,
    failedTextFiles,
    isAccessDenied,
    isEmpty: imageFiles.length === 0,
    reset: resetState,
    writeTextFile,
    loadImage,
    writeCaption,
  };

  return (
    <DatasetDirectoryContext.Provider value={value}>
      {children}
    </DatasetDirectoryContext.Provider>
  );
};
