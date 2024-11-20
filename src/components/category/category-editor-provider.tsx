import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Category } from "@/lib/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useImageNavigation } from "../../hooks/provider/image-navigation-provider";
import { usePreventClose } from "../../hooks/provider/prevent-close-provider";
import { uuid } from "@/lib/utils";
import { usePrevious } from "@uidotdev/usehooks"
import { useShortcut } from "../../hooks/use-shortcut";
import { useDatabase } from "@/lib/database/database-provider";
import { ImageEntity } from "@/lib/database/image-entity";

interface CategoryEditorContextType {
  categories: Category[];
  addCategory: (category: string, prepend?: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDragEnd: (event: any) => void;
  enterEditMode: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  cancelEditMode: () => void;
  clearCategories: () => void;
  save: () => void;
  isEditing: Category | null;
  isDirty: boolean;
}

const CategoryEditorContext = createContext<CategoryEditorContextType | undefined>(
  undefined
);

interface CategoryEditorProviderProps {
  children: ReactNode;
}

export const CategoryEditorProvider: React.FC<CategoryEditorProviderProps> = ({
  children,
}) => {
  const { database } = useDatabase()
  const { currentImage } = useImageNavigation();
  const [isDirty, setDirty] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPart, setEditingPart] = useState<Category | null>(null);
  const previousImage = usePrevious(currentImage);

  usePreventClose(isDirty, () => save());
  useShortcut("saveCategories", () => {
    save();
  });
  useShortcut("clearCategories", () => {
    clearCategories();
  });

  const addCategory = (text: string, prepend?: boolean) => {
    if (categories.some((item) => item.text === text)) {
      return
    }

    if (prepend) {
      setCategories((prevCategory) => [{
        id: uuid(),
        text,
        index: 0,
      }, ...prevCategory.map((category) => ({
        ...category,
        index: category.index + 1,
      }))]);
    } else {
      setCategories((prevCategory) => [...prevCategory, {
        id: uuid(),
        text,
        index: prevCategory.length,
      }]);
    }
    setDirty(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setCategories((prevCategory: Category[]) => {
      const oldIndex = prevCategory.findIndex((item) => item.id === active.id);
      const newIndex = prevCategory.findIndex((item) => item.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return prevCategory;
      }
      const updatedParts = arrayMove(prevCategory, oldIndex, newIndex);
      updatedParts.forEach((part, index) => {
        part.index = index;
      });
      return updatedParts
    });
    setDirty(true);
  };

  const enterEditMode = (part: Category) => {
    const categoryExists = categories.some((item) => item.id === part.id);
    if (!categoryExists) {
      throw new Error("Part not found in caption.");
    }
    setEditingPart(part);
  };

  const updateCategory = (part: Category) => {
    setCategories((prevCategory) => {
      const index = prevCategory.findIndex((item) => item.id === part.id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = [...prevCategory];
      updatedParts[index] = part;

      setEditingPart(null);
      setDirty(true);

      return updatedParts;
    });

  };
  const deleteCategory = (id: string) => {
    setCategories((prevCategory) => {
      const index = prevCategory.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error("Part not found in caption.");
      }

      const updatedParts = prevCategory.filter((item) => item.id !== id);

      setEditingPart(null);
      setDirty(true);

      return updatedParts;
    });
  };

  const resetEditor = () => {
    setCategories([]);
    setEditingPart(null);
    setDirty(false);
  };

  const clearCategories = () => {
    setCategories([]);
    setDirty(true);
  }

  const save = async (image: ImageEntity | undefined = currentImage) => {
    if (!image || !isDirty) {
      return
    }
    await database.images.put({
      ...image,
      id: image.filename,
      categories,
    })
    setDirty(false);
  }

  const load = async () => {
    if (!database || !currentImage) {
      return
    }
    setCategories(currentImage.categories?.map(category => category as Category) ?? [])
  }

  useEffect(() => {
    if (previousImage) {
      save(previousImage)
    }
    resetEditor();
    load()
  }, [currentImage?.id]);


  const value: CategoryEditorContextType = {
    categories,
    addCategory,
    handleDragEnd,
    enterEditMode,
    cancelEditMode: () => setEditingPart(null),
    updateCategory,
    deleteCategory,
    isEditing: editingPart,
    isDirty,
    save,
    clearCategories,
  };

  return (
    <CategoryEditorContext.Provider value={value}>
      {children}
    </CategoryEditorContext.Provider>
  );
};

export const useCategoryEditor = (): CategoryEditorContextType => {
  const context = useContext(CategoryEditorContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryEditor must be used within an CategoryEditorProvider"
    );
  }
  return context;
};
