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
import { useImageCaption } from "@/lib/image-caption-provider";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { useEffect, useRef } from "react";

export const CaptionList = () => {
  const { caption, handleDragEnd } = useImageCaption();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const partRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastLength = useRef(0);

  useEffect(() => {
    const lastPart = caption.parts[caption.parts.length - 1];
    if (caption.parts.length === lastLength.current) {
      return;
    }
    if (caption.parts.length > 0 && lastPart && partRefs.current[lastPart.id]) {
      partRefs.current[lastPart.id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      lastLength.current = caption.parts.length;
    }
  }, [caption.parts]);

  return (
    <div className="border-l ml-2 h-full flex flex-col">
      <h1 className="mb-2 ml-4">Caption</h1>
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
            items={caption.parts}
            strategy={verticalListSortingStrategy}
          >
            <AnimatedGroup preset="blur-slide" className="flex flex-col gap-2">
              {caption.parts.map((item) => (
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
