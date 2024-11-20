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
import { CaptionListItem } from "./caption-list-item";
import { CaptionListFooter } from "./caption-list-footer";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { useEffect, useRef } from "react";
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { CaptionListDropdown } from "./caption-list-dropdown";
import { useArrowKeyNavigation } from "@/components/common/arrow-key-navigation-provider";

export const CaptionList = () => {
  const { parts, handleDragEnd } = useCaptionEditor();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { setLength } = useArrowKeyNavigation()
  const partRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastLength = useRef(0);

  useEffect(() => {
    setLength(parts.length)
  }, [parts.length, setLength])

  useEffect(() => {
    const lastPart = parts[parts.length - 1];
    if (parts.length === lastLength.current) {
      return;
    }
    if (parts.length > 0 && lastPart && partRefs.current[lastPart.id]) {
      partRefs.current[lastPart.id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      lastLength.current = parts.length;
    }
  }, [parts]);

  return (
    <div className="border-l ml-2 h-full flex flex-col">
      <div className="flex flex-row gap-2 justify-between items-center mb-2">
        <h1 className="ml-4 font-semibold">Caption Parts </h1>
        <CaptionListDropdown />
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
            items={parts}
            strategy={verticalListSortingStrategy}
          >
            <AnimatedGroup preset="blur-slide" className="flex flex-col gap-2">
              {parts.map((item) => (
                <CaptionListItem
                  key={item.id}
                  part={item}
                  ref={(el) => (partRefs.current[item.id] = el)}
                />
              ))}
            </AnimatedGroup>
          </SortableContext>
        </DndContext>
      </div>
      <div className="border-t">
        <div className="ml-4">
          <CaptionListFooter />
        </div>
      </div>
    </div>
  );
};
