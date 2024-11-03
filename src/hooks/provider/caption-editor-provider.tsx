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
import { usePreventClose } from "./prevent-close-provider";
import { uuid } from "@/lib/utils";
import { usePrevious } from "@uidotdev/usehooks"
import { useShortcut } from "../use-shortcut";
import { database } from "@/lib/database/database";
import { useCaptionPreview } from "../use-caption-preview";

interface CaptionEditorContextType {
  parts: CaptionPart[];
  preview: string | null;
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
  refetchPreview: () => void;
  isLoadingPreview: boolean;
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
  const { currentImage } = useImageNavigation();
  const [isDirty, setDirty] = useState(false);
  const [parts, setParts] = useState<CaptionPart[]>([]);
  const [editingPart, setEditingPart] = useState<CaptionPart | null>(null);
  const previousImage = usePrevious(currentImage);
  const { preview, ai: { isLoading, refetch } } = useCaptionPreview({
    parts,
    initialValue: currentImage?.caption,
  });

  usePreventClose(isDirty);
  useShortcut("save", () => {
    save();
  });
  useShortcut("clearCaption", () => {
    clearParts();
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
    setEditingPart(null);
    setDirty(false);
  };

  const clearParts = () => {
    setParts([]);
    setDirty(true);
  }

  const save = async (filename?: string) => {
    if (!currentImage || !isDirty) {
      return
    }
    await database.images.put({
      id: filename ?? currentImage.filename,
      filename: filename ?? currentImage.filename,
      caption: preview ?? undefined,
      captionParts: parts,
    })
    setDirty(false);
  }

  const load = async () => {
    if (!database || !currentImage) {
      return
    }
    setParts(currentImage.captionParts?.map(part => part as CaptionPart) ?? [])
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
    refetchPreview: refetch,
    isLoadingPreview: isLoading,
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
