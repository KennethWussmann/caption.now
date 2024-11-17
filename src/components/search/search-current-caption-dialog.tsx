import { Dialog, DialogContent, DialogDescription, DialogTitle, Input, Separator } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useCaptionEditor } from "../caption/caption-editor-provider";
import { CaptionPart } from "@/lib/types";
import { useSearchCurrentCaptionDialog } from "./search-current-caption-dialog-provider";

export const SearchCurrentCaptionDialog = () => {
  const { isDialogOpen, closeDialog } = useSearchCurrentCaptionDialog();
  const { parts, enterEditMode } = useCaptionEditor();
  const [searchText, setSearchText] = useState("");
  const [filteredParts, setFilteredParts] = useState<CaptionPart[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const reset = () => {
    setSearchText("");
    setFilteredParts([]);
    setSelectedIndex(0);
  };

  const fuzzySearch = (query: string, items: CaptionPart[]) => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) =>
      item.text.toLowerCase().includes(lowerQuery)
    );
  };

  useEffect(() => {
    const results = fuzzySearch(searchText, parts);
    setFilteredParts(results);
    setSelectedIndex(0);
  }, [searchText, parts]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<span class='bg-yellow-300 dark:bg-yellow-700'>$1</span>");
  };


  const executeAction = useCallback((part: CaptionPart) => {
    enterEditMode(part);
    closeDialog();
    reset();
  }, [closeDialog, enterEditMode]);

  const handleArrowNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!isDialogOpen || !filteredParts.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredParts.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          (prev - 1 + filteredParts.length) % filteredParts.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeAction(filteredParts[selectedIndex]);
      }
    },
    [isDialogOpen, filteredParts, executeAction, selectedIndex]
  );

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }
    window.addEventListener("keydown", handleArrowNavigation);
    return () => window.removeEventListener("keydown", handleArrowNavigation);
  }, [handleArrowNavigation, isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        closeDialog();
        reset();
      }}
    >
      <DialogContent hideClose className="p-1">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search inside captions of current image</DialogDescription>

        <div className="flex flex-col gap-2">
          <Input
            className="h-14 pl-4 text-xl"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={`Search in current caption ...`}
            autoFocus
          />
          {searchText.length > 0 && filteredParts.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-1">
                {filteredParts.map((part, index) => (
                  <div
                    key={part.id}
                    className={`p-1 px-2 border rounded-md ${selectedIndex === index ? "bg-muted" : ""
                      }`}
                    onClick={() => executeAction(part)}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(part.text, searchText),
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
