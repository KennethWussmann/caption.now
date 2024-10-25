import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CaptionItem } from "../types";
import { CaptionListItem } from "./caption-list-item";
import { CaptionListFooter } from "./caption-list-footer";

const defaultCaptions: CaptionItem[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: i,
    text: `Caption ${i + 1}`,
  })
);

export const CaptionList = () => {
  const [captions, setCaptions] = useState(defaultCaptions);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCaptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
            items={captions}
            strategy={verticalListSortingStrategy}
          >
            <CaptionListItem
              caption={{ id: 111, text: "Cute cat sleeping on couch" }}
              editing
            />
            {captions.map((item) => (
              <CaptionListItem key={item.id} caption={item} />
            ))}
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
