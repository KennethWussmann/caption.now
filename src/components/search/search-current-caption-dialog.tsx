import { Dialog, DialogContent, DialogDescription, DialogTitle, Input, Separator, Toggle } from "@/components/ui";
import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { useCaptionEditor } from "../caption/caption-editor-provider";
import { CaptionPart } from "@/lib/types";
import { useSearchCurrentCaptionDialog } from "./search-current-caption-dialog-provider";
import { ReplaceAll, Search, Settings2 } from "lucide-react";
import clsx from "clsx";
import { ScrollArea } from "../ui/scroll-area";
import { IconTooltipButton } from "../common/icon-tooltip-button";

const renderHighlightedText = (text: string, query: string, replaceText: string, isReplaceEnabled: boolean) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      if (isReplaceEnabled && replaceText) {
        return (
          <Fragment key={index}>
            <span className="bg-red-300 dark:bg-red-700 line-through">{part}</span>
            <span className="bg-green-300 dark:bg-green-700">{replaceText}</span>
          </Fragment>
        );
      }
      return (
        <span key={index} className="bg-yellow-300 dark:bg-yellow-700">
          {part}
        </span>
      );
    }
    return part;
  });
};

export const SearchCurrentCaptionDialog = () => {
  const { isDialogOpen, closeDialog } = useSearchCurrentCaptionDialog();
  const { parts, enterEditMode, updatePart } = useCaptionEditor();
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [filteredParts, setFilteredParts] = useState<CaptionPart[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReplaceEnabled, setReplaceEnabled] = useState(false)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const reset = () => {
    setSearchText("");
    setReplaceText("");
    setFilteredParts([]);
    setSelectedIndex(0);
    setReplaceEnabled(false);
    itemRefs.current = {};
  };

  const fuzzySearch = (query: string, items: CaptionPart[]) => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) =>
      item.text.toLowerCase().includes(lowerQuery)
    );
  };

  const updateFilteredParts = useCallback(() => {
    const results = fuzzySearch(searchText, parts);
    itemRefs.current = {};
    setFilteredParts(results);
    setSelectedIndex(0);
  }, [searchText, parts]);

  useEffect(() => {
    updateFilteredParts();
  }, [searchText, parts, updateFilteredParts]);

  const replaceSingle = useCallback((part: CaptionPart) => {
    updatePart({
      ...part,
      text: part.text.replace(new RegExp(searchText, "gi"), replaceText),
    });
  }, [replaceText, searchText, updatePart]);

  const replaceAll = useCallback(() => {
    filteredParts.forEach((part) => {
      replaceSingle(part);
    });

  }, [filteredParts, replaceSingle]);

  const editPart = useCallback((part: CaptionPart) => {
    enterEditMode(part);
    closeDialog();
    reset();
  }, [closeDialog, enterEditMode]);

  const executeAction = useCallback((part: CaptionPart) => {
    if (isReplaceEnabled && replaceText.length > 0) {
      replaceSingle(part);
    } else if (!isReplaceEnabled) {
      editPart(part);
    }
  }, [editPart, isReplaceEnabled, replaceSingle, replaceText.length]);

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

        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Search size={25} className="ml-2 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={`Search in current caption ...`}
              className="border-none outline-none pl-0 focus-visible:ring-0"
              autoFocus
            />
            <Toggle pressed={isReplaceEnabled} onPressedChange={setReplaceEnabled}>
              <Settings2 />
            </Toggle>
          </div>
          {isReplaceEnabled && (
            <>
              <Separator />
              <div className="flex items-center gap-1">
                <Input
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replace with ..."
                  className="border-none outline-none focus-visible:ring-0"
                />
                <IconTooltipButton
                  icon={ReplaceAll}
                  tooltip="Replace all results"
                  disabled={replaceText.length === 0 || filteredParts.length === 0}
                  onClick={replaceAll}
                />
              </div>
            </>
          )}
          {searchText.length > 0 && filteredParts.length > 0 && (
            <>
              <Separator />
              <ScrollArea className="max-h-[400px]">
                <div className="flex flex-col gap-1">
                  {filteredParts.map((part, index) => (
                    <div
                      key={part.id}
                      className={clsx(`p-1 px-2 rounded-md`, {
                        "bg-muted": index === selectedIndex,
                      })}
                      onClick={() => executeAction(part)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      ref={(el) => (itemRefs.current[part.id] = el)}
                    >
                      {renderHighlightedText(part.text, searchText, replaceText, isReplaceEnabled)}
                    </div>
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
