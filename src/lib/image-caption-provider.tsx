import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Caption, CaptionPart, ImageFile } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";

// Define the context value type
interface ImageCaptionContextType {
  imageFile: ImageFile | null;
  caption: Caption;
  setImageFile: (file: ImageFile) => void;
  setCaption: (caption: Caption) => void;
  addPart: (part: CaptionPart) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDragEnd: (event: any) => void;
  enterEditMode: (part: CaptionPart) => void;
  updatePart: (part: CaptionPart) => void;
  deletePart: (partId: string) => void;
  cancelEditMode: () => void;
  isEditing: CaptionPart | null;
}

// Create the context
const ImageCaptionContext = createContext<ImageCaptionContextType | undefined>(
  undefined
);

// Create a provider component
interface ImageCaptionProviderProps {
  children: ReactNode;
}

export const ImageCaptionProvider: React.FC<ImageCaptionProviderProps> = ({
  children,
}) => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [caption, setCaption] = useState<Caption>({
    parts: [],
  });
  const [editingPart, setEditingPart] = useState<CaptionPart | null>(null);

  // Function to add a part to the caption parts array
  const addPart = (part: CaptionPart) => {
    setCaption((prevCaption: Caption) => ({
      ...prevCaption,
      parts: [...prevCaption.parts, part],
    }));
  };

  // Function to handle drag and drop reordering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setCaption((prevCaption: Caption) => {
      const oldIndex = prevCaption.parts.findIndex(
        (item: CaptionPart) => item.id === active.id
      );
      const newIndex = prevCaption.parts.findIndex(
        (item: CaptionPart) => item.id === over.id
      );

      if (oldIndex === -1 || newIndex === -1) {
        return prevCaption; // Return unchanged if indices are invalid
      }

      const updatedParts = arrayMove(prevCaption.parts, oldIndex, newIndex);
      return {
        ...prevCaption,
        parts: updatedParts,
      };
    });
  };

  // Function to enter edit mode with a specific part
  const enterEditMode = (part: CaptionPart) => {
    const partExists = caption.parts.some((item) => item.id === part.id);
    if (!partExists) {
      throw new Error("Part not found in caption.");
    }
    setEditingPart(part);
  };

  const updatePart = (part: CaptionPart) => {
    setCaption((prevCaption) => {
      const index = prevCaption.parts.findIndex((item) => item.id === part.id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = [...prevCaption.parts];
      updatedParts[index] = part;

      setEditingPart(null);

      return {
        ...prevCaption,
        parts: updatedParts,
      };
    });
  };
  const deletePart = (id: string) => {
    setCaption((prevCaption) => {
      const index = prevCaption.parts.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = prevCaption.parts.filter((item) => item.id !== id);

      setEditingPart(null);

      return {
        ...prevCaption,
        parts: updatedParts,
      };
    });
  };

  const resetEditor = () => {
    setCaption({ parts: [] });
    setEditingPart(null);
  };

  useEffect(() => {
    resetEditor();
  }, [imageFile]);

  // Context value to be provided
  const value: ImageCaptionContextType = {
    imageFile,
    setImageFile,
    caption,
    setCaption,
    addPart,
    handleDragEnd,
    enterEditMode,
    cancelEditMode: () => setEditingPart(null),
    updatePart,
    deletePart,
    isEditing: editingPart,
  };

  return (
    <ImageCaptionContext.Provider value={value}>
      {children}
    </ImageCaptionContext.Provider>
  );
};

// Custom hook for consuming the context
export const useImageCaption = (): ImageCaptionContextType => {
  const context = useContext(ImageCaptionContext);
  if (context === undefined) {
    throw new Error(
      "useImageCaption must be used within an ImageCaptionProvider"
    );
  }
  return context;
};
