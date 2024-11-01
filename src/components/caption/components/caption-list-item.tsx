import { Card } from "../../ui/card";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { CaptionPart } from "@/lib/types";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import { useCaptionEditor } from "@/hooks/provider/caption-editor-provider";

export const CaptionListItem = forwardRef<
  HTMLDivElement,
  { part: CaptionPart }
>(({ part }, ref) => {
  const { enterEditMode, isEditing, deletePart } = useCaptionEditor();
  const isCurrentItemEditing = isEditing?.id === part.id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: part.id });
  const customTransitions =
    "box-shadow 0.3s ease, margin 0.3s ease, background-color 0.3s ease";
  const finalTransition = transition
    ? `${transition}, ${customTransitions}`
    : customTransitions;

  const localRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => localRef.current!);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
    >
      <Card
        className={clsx(
          "flex justify-between align-middle items-center gap-2 p-1 pl-4 ml-4",
          {
            "border-blue-600 border-2 border-dashed bg-blue-50 dark:bg-blue-600 dark:bg-opacity-40":
              isCurrentItemEditing,
          }
        )}
        style={{
          transform: CSS.Transform.toString({
            x: 0,
            y: transform?.y ?? 0,
            scaleX: transform?.scaleX ?? 1,
            scaleY: transform?.scaleY ?? 1,
          }),
          transition: finalTransition,
          boxShadow: isDragging ? "0px 8px 16px rgba(0,0,0,0.2)" : "none",
          zIndex: isDragging ? 10 : undefined,
        }}
        ref={(node) => {
          setNodeRef(node);
          localRef.current = node!;
        }}
        onDoubleClick={() => enterEditMode(part)}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-row gap-4 items-center">
          {isCurrentItemEditing && (
            <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-200" />
          )}
          {part.text}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-30"
            align="end"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => deletePart(part.id)}>
              <Trash />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => enterEditMode(part)}>
              <Pencil />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </motion.div>
  );
});
