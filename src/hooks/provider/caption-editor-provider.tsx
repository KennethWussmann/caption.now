import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { CaptionPart } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useImageNavigation } from "./image-navigation-provider";
import { useDatabase } from "@/lib/database/database-provider";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { usePreventClose } from "./prevent-close-provider";
import { uuid } from "@/lib/utils";
import { usePrevious } from "@uidotdev/usehooks"
import { useShortcut } from "../use-shortcut";

interface CaptionEditorContextType {
  parts: CaptionPart[];
  preview: string | null;
  setPreview: (preview: string | null) => void;
  addPart: (part: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDragEnd: (event: any) => void;
  enterEditMode: (part: CaptionPart) => void;
  updatePart: (part: CaptionPart) => void;
  deletePart: (partId: string) => void;
  cancelEditMode: () => void;
  clearParts: () => void;
  save: () => void;
  isEditing: CaptionPart | null;
  isDirty: boolean;
}

const CaptionEditorContext = createContext<CaptionEditorContextType | undefined>(
  undefined
);

interface CaptionEditorProviderProps {
  children: ReactNode;
}

export const CaptionEditorProvider: React.FC<CaptionEditorProviderProps> = ({
  children,
}) => {
  const [separator] = useAtom(settings.caption.separator);
  const { database } = useDatabase();
  const { currentImage } = useImageNavigation();
  const [isDirty, setDirty] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [parts, setParts] = useState<CaptionPart[]>([]);
  const [editingPart, setEditingPart] = useState<CaptionPart | null>(null);
  const previousImage = usePrevious(currentImage);

  usePreventClose(isDirty);
  useShortcut("save", () => {
    save();
  });

  const addPart = (text: string) => {
    setParts((prevParts) => [...prevParts, {
      id: uuid(),
      text,
      index: prevParts.length,
    }]);
    setDirty(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setParts((prevParts: CaptionPart[]) => {
      const oldIndex = prevParts.findIndex((item) => item.id === active.id);
      const newIndex = prevParts.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return prevParts;
      }
      const updatedParts = arrayMove(prevParts, oldIndex, newIndex);
      updatedParts.forEach((part, index) => {
        part.index = index;
      });
      return updatedParts
    });
    setDirty(true);
  };

  const enterEditMode = (part: CaptionPart) => {
    const partExists = parts.some((item) => item.id === part.id);
    if (!partExists) {
      throw new Error("Part not found in caption.");
    }
    setEditingPart(part);
  };

  const updatePart = (part: CaptionPart) => {
    setParts((prevParts) => {
      const index = prevParts.findIndex((item) => item.id === part.id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = [...prevParts];
      updatedParts[index] = part;

      setEditingPart(null);
      setDirty(true);

      return updatedParts;
    });

  };
  const deletePart = (id: string) => {
    setParts((prevParts) => {
      const index = prevParts.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = prevParts.filter((item) => item.id !== id);

      setEditingPart(null);
      setDirty(true);

      return updatedParts;
    });
  };

  const resetEditor = () => {
    setParts([]);
    setPreview(null);
    setEditingPart(null);
    setDirty(false);
  };

  const clearParts = () => {
    setParts([]);
    setDirty(true);
  }

  const save = async (filename?: string) => {
    if (!database || !currentImage || !isDirty) {
      return
    }
    await database.images.upsert({
      filename: filename ?? currentImage.filename,
      caption: parts.map((part) => part.text).join(separator),
      captionParts: parts,
    })
    setDirty(false);
  }

  const load = async () => {
    if (!database || !currentImage) {
      return
    }
    setParts(currentImage.captionParts?.map(part => part as CaptionPart) ?? [])
    setPreview(currentImage.caption ?? null)
  }

  useEffect(() => {
    if (previousImage) {
      save(previousImage?.filename)
    }
    resetEditor();
    load()
  }, [currentImage?.id]);


  const value: CaptionEditorContextType = {
    parts,
    preview,
    setPreview,
    addPart,
    handleDragEnd,
    enterEditMode,
    cancelEditMode: () => setEditingPart(null),
    updatePart,
    deletePart,
    isEditing: editingPart,
    isDirty,
    save,
    clearParts,
  };

  return (
    <CaptionEditorContext.Provider value={value}>
      {children}
    </CaptionEditorContext.Provider>
  );
};

export const useCaptionEditor = (): CaptionEditorContextType => {
  const context = useContext(CaptionEditorContext);
  if (context === undefined) {
    throw new Error(
      "useCaptionEditor must be used within an CaptionEditorProvider"
    );
  }
  return context;
};
