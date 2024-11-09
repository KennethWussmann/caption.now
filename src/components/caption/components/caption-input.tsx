import { Input } from "@/components/ui/input";
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { settings } from "@/lib/settings";
import clsx from "clsx";
import { useAtom } from "jotai/react";
import { ArrowUp, Pencil, X } from "lucide-react";
import { KeyboardEvent, useEffect, useRef } from "react";
import { useApplyTextReplacements } from "@/hooks/use-apply-text-replacements";

export const EditBanner = ({ onCancel }: { onCancel?: VoidFunction }) => {
  const { isEditing, cancelEditMode } = useCaptionEditor();

  const stopEditing = () => {
    onCancel?.();
    cancelEditMode();
  };

  return (
    <div className="flex gap-2 justify-between items-center  p-1 px-2 rounded-t-md border border-input border-b-0 border-solid bg-secondary">
      <div className="flex gap-2 items-center text-xs text-muted-foreground">
        <Pencil className="w-4 h-4" />
        You are editing
        <div className="italic">"{isEditing?.text}"</div>
      </div>
      <X
        className="w-4 h-4 hover:cursor-pointer rounded-sm"
        onClick={stopEditing}
      />
    </div>
  );
};

export const CaptionInput = () => {
  const [separator] = useAtom(settings.caption.separator);
  const [value, setValue] = useApplyTextReplacements();
  const {
    isEditing,
    addPart,
    updatePart,
    enterEditMode,
    cancelEditMode,
    deletePart,
    parts,
  } = useCaptionEditor();
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const sanitizeValue = (value: string) => value.trim();
  const splitIntoParts = (value: string) =>
    value.split(separator.trim())
      .map((text) => text.trim())
      .filter((text) => text !== "");

  const onSubmit = () => {
    const sanitizedValue = sanitizeValue(value);
    const parts = splitIntoParts(sanitizedValue);
    if (isEditing) {
      if (sanitizedValue === "") {
        cancelEditMode();
        deletePart(isEditing.id);
        setValue("");
        return;
      }
      const part = {
        ...isEditing,
        text: sanitizedValue,
      };
      updatePart(part);
    } else {
      if (sanitizedValue === "") {
        return;
      }
      parts.forEach((part) => addPart(part));
    }
    setValue("");
  };

  const onEditLast = () => {
    if (isEditing || value.trim() !== "" || parts.length === 0) {
      return;
    }
    enterEditMode(parts[parts.length - 1]);
  };

  const onCancelEditing = () => {
    setValue("");
    cancelEditMode();
  };

  useEffect(() => {
    if (isEditing) {
      setValue(isEditing.text);
      inputFieldRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="flex gap-2 flex-col">
      <div className="flex w-full items-center space-x-2">
        <div className="w-full">
          {isEditing && <EditBanner onCancel={() => setValue("")} />}
          <Input
            type="text"
            className={clsx("h-14 pl-4 text-xl", {
              "rounded-t-none": isEditing,
            })}
            placeholder={
              isEditing ? "Edit caption ..." : "Write a sentence ..."
            }
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                onSubmit();
              }
              if (event.key === "ArrowUp") {
                onEditLast();
              }
              if (event.key === "Escape" && isEditing) {
                onCancelEditing();
              }
            }}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            ref={inputFieldRef}
            autoFocus
          />
        </div>
      </div>
      <div className="flex gap-1 text-xs text-muted-foreground">
        Hit <kbd>Enter</kbd> to submit{" "}
        {isEditing && (
          <>
            or <kbd>Escape</kbd>
            to cancel editing
          </>
        )}
        {!isEditing && sanitizeValue(value).length === 0 && (
          <>
            or <ArrowUp className="h-4 w-4" />
            to edit last caption
          </>
        )}
      </div>
    </div>
  );
};
