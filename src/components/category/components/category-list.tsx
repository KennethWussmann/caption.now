import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { useEffect, useRef } from "react";
import { useCategoryEditor } from "../category-editor-provider";
import { CategoryListDropdown } from "./category-list-dropdown";
import { CategoryListItem } from "./category-list-item";

export const CategoryList = () => {
  const { categories, handleDragEnd } = useCategoryEditor();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const partRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastLength = useRef(0);

  useEffect(() => {
    const lastPart = categories[categories.length - 1];
    if (categories.length === lastLength.current) {
      return;
    }
    if (categories.length > 0 && lastPart && partRefs.current[lastPart.id]) {
      partRefs.current[lastPart.id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      lastLength.current = categories.length;
    }
  }, [categories]);

  return (
    <div className="border-l ml-2 h-full flex flex-col">
      <div className="flex flex-row gap-2 justify-between items-center mb-2">
        <h1 className="ml-4 font-semibold">Categories </h1>
        <CategoryListDropdown />
      </div>
      <div
        className="flex flex-col overflow-y-auto gap-1 pb-4"
        style={{ flex: "1 1 0", minHeight: 0 }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories}
            strategy={verticalListSortingStrategy}
          >
            <AnimatedGroup preset="blur-slide" className="flex flex-col gap-2">
              {categories.map((item) => (
                <CategoryListItem
                  key={item.id}
                  category={item}
                  ref={(el) => (partRefs.current[item.id] = el)}
                />
              ))}
            </AnimatedGroup>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
