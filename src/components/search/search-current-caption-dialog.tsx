import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, Input, Separator } from "@/components/ui";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCaptionEditor } from "../caption/caption-editor-provider";
import { CaptionPart } from "@/lib/types";
import { useSearchCurrentCaptionDialog } from "./search-current-caption-dialog-provider";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { ScrollArea } from "../ui/scroll-area";

export const SearchCurrentCaptionDialog = () => {
  const { isDialogOpen, closeDialog } = useSearchCurrentCaptionDialog();
  const { parts, enterEditMode } = useCaptionEditor();
  const [searchText, setSearchText] = useState("");
  const [filteredParts, setFilteredParts] = useState<CaptionPart[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const reset = () => {
    setSearchText("");
    setFilteredParts([]);
    setSelectedIndex(0);
    itemRefs.current = {};
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
    itemRefs.current = {};
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

  useEffect(() => {
    if (!isDialogOpen || !filteredParts.length) return;
    itemRefs.current[filteredParts[selectedIndex].id]?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, [filteredParts, isDialogOpen, selectedIndex]);

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
          <div className="flex gap-2 items-center">
            <Search size={25} className="ml-2 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={`Search in current caption ...`}
              className="border-none outline-none pl-0 focus-visible:ring-0"
              autoFocus
            />
            <Button variant="link" size="icon" onClick={closeDialog}>
              <X size={20} />
            </Button>
          </div>
          {searchText.length > 0 && filteredParts.length > 0 && (
            <>
              <Separator />
              <ScrollArea className="max-h-[200px]">
                <div className="flex flex-col gap-1">
                  {filteredParts.map((part, index) => (
                    <div
                      key={part.id}
                      className={clsx(`p-1 px-2 rounded-md`, {
                        "bg-muted": index === selectedIndex,
                      })}
                      onClick={() => executeAction(part)}
                      dangerouslySetInnerHTML={{
                        __html: highlightText(part.text, searchText),
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      ref={(el) => (itemRefs.current[part.id] = el)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
