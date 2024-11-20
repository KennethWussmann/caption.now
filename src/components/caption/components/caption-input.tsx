import { Input } from "@/components/ui/input";
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { settings } from "@/lib/settings";
import clsx from "clsx";
import { useAtom } from "jotai/react";
import { ArrowDown, ArrowUp, Pencil, X } from "lucide-react";
import { KeyboardEvent, useEffect, useRef } from "react";
import { useApplyTextReplacements } from "@/hooks/use-apply-text-replacements";
import { useShortcut } from "@/hooks/use-shortcut";
import { useArrowKeyNavigation } from "@/components/common/arrow-key-navigation-provider";

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
    cancelEditMode,
    deletePart,
  } = useCaptionEditor();
  const inputFieldRef = useRef<HTMLInputElement>(null);
  useShortcut("focusInput", () => {
    inputFieldRef.current?.focus();
  });
  const { enable, isEnabled, selectFirst, selectLast } = useArrowKeyNavigation()

  const sanitizeValue = (value: string) => value.trim();
  const isEmpty = sanitizeValue(value).length === 0
  const splitIntoParts = (value: string) =>
    value.split(separator.trim())
      .map((text) => text.trim())
      .filter((text) => text !== "");

  const onSubmit = (prepend = false) => {
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
      parts.forEach((part) => addPart(part, prepend));
    }
    setValue("");
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
                if (isEnabled) {
                  return
                }
                onSubmit(event.shiftKey);
              }
              if (event.key === "ArrowUp" && !isEditing) {
                if (!isEnabled) {
                  event.preventDefault()
                  enable()
                  setTimeout(selectLast, 10)
                }
              }
              if (event.key === "ArrowDown" && !isEditing) {
                if (!isEnabled) {
                  event.preventDefault()
                  enable()
                  setTimeout(selectFirst, 10)
                }
              }
              if (event.key === "Escape" && isEditing) {
                onCancelEditing();
              }
            }}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            ref={inputFieldRef}
            autoFocus
            disabled={isEnabled}
          />
        </div>
      </div>
      <div className="flex gap-1 text-xs text-muted-foreground">
        Hit <kbd>Enter</kbd>
        {isEnabled && !isEditing ? <>to edit highlighted part or <kbd>Escape</kbd> to cancel</> : isEmpty && isEditing ? "to delete part " : "to submit "}
        {isEditing && (
          <>
            or <kbd>Escape</kbd>
            to cancel editing
          </>
        )}
        {!isEditing && !isEnabled && isEmpty && (
          <>
            or <ArrowUp className="h-4 w-4" /><ArrowDown className="h-4 w-4" />
            to navigate caption parts
          </>
        )}
      </div>
    </div>
  );
};
