import { Input } from "@/components/ui/input";
import { settings } from "@/lib/settings";
import clsx from "clsx";
import { useAtom } from "jotai/react";
import { Pencil, X } from "lucide-react";
import { KeyboardEvent, ReactNode, useEffect, useRef } from "react";
import { useCategoryEditor } from "../category-editor-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCategorySuggestions } from "../use-category-suggestions";
import { useApplyTextReplacements } from "@/hooks/use-apply-text-replacements";
import { useShortcut } from "@/hooks/use-shortcut";

const Suggestion = ({ children, onApply, active }: { children: ReactNode, onApply: VoidFunction, active?: boolean }) => {
  return (
    <div className={clsx(
      "px-2 py-1 rounded-sm select-none cursor-pointer hover:bg-accent hover:text-accent-foreground",
      { "bg-accent text-accent-foreground": active }
    )} onClick={onApply}>
      {children}
    </div>
  )
}
const SuggestionsPopoverContent = ({ suggestions, selected, onApply }: { suggestions: string[], onApply: (suggestion: string) => void; selected: string | null }) => {
  return (
    <PopoverContent align="start" className="p-2 flex flex-col gap-1">
      {suggestions.map((suggestion) => (
        <Suggestion key={suggestion} onApply={() => onApply(suggestion)} active={suggestion === selected}>{suggestion}</Suggestion>
      ))}
    </PopoverContent>
  );
}

const EditBanner = ({ onCancel }: { onCancel?: VoidFunction }) => {
  const { isEditing, cancelEditMode } = useCategoryEditor();

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

export const CategoryInput = () => {
  const [separator] = useAtom(settings.category.separator);
  const [value, setValue] = useApplyTextReplacements();
  const {
    isEditing,
    addCategory,
    updateCategory,
    cancelEditMode,
    deleteCategory,
  } = useCategoryEditor();
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const { suggestions, selected, selectNext, selectPrevious } = useCategorySuggestions(value);
  useShortcut("focusInput", () => {
    inputFieldRef.current?.focus();
  });

  const sanitizeValue = (value: string) => value.trim();
  const splitIntoCategories = (value: string) =>
    value.split(separator.trim())
      .map((text) => text.trim())
      .filter((text) => text !== "");

  const onSubmit = () => {
    const sanitizedValue = sanitizeValue(value);
    const categories = splitIntoCategories(sanitizedValue);
    if (isEditing) {
      if (sanitizedValue === "") {
        cancelEditMode();
        deleteCategory(isEditing.id);
        setValue("");
        return;
      }
      const category = {
        ...isEditing,
        text: sanitizedValue,
      };
      updateCategory(category);
    } else {
      if (sanitizedValue === "") {
        return;
      }
      categories.forEach((category) => addCategory(category));
    }
    setValue("");
  };

  const onCancelEditing = () => {
    setValue("");
    cancelEditMode();
  };

  const applySuggestion = (suggestion: string) => {
    addCategory(suggestion);
    setValue("");
  }

  useEffect(() => {
    if (isEditing) {
      setValue(isEditing.text);
    }
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 100)
  }, [isEditing, suggestions]);

  return (
    <Popover open={!isEditing && suggestions.length > 0}>
      <PopoverTrigger>
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
                  isEditing ? "Edit category ..." : "Write a category ..."
                }
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (selected && !isEditing) {
                      applySuggestion(selected);
                    } else {
                      onSubmit();
                    }
                  }
                  if (!isEditing && event.key === "ArrowUp") {
                    event.preventDefault();
                    selectPrevious();
                  }
                  if (!isEditing && event.key === "ArrowDown") {
                    event.preventDefault();
                    selectNext();
                  }
                  if (isEditing && event.key === "Escape") {
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
            {!isEditing && suggestions.length > 0 && (
              <>
                or ↑ ↓ to navigate suggestions and then <kbd>Enter</kbd> to apply
              </>
            )}
          </div>
        </div>
      </PopoverTrigger>
      <SuggestionsPopoverContent selected={selected} suggestions={suggestions} onApply={applySuggestion} />
    </Popover>
  );
};
