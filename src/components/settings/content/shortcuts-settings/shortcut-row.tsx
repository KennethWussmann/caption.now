import { Button } from "@/components/ui";
import { TableCell, TableRow } from "@/components/ui/table";
import { settings, Settings } from "@/lib/settings";
import { replaceShortcutSymbols } from "@/lib/utils";
import clsx from "clsx";
import { useAtom } from "jotai/react";
import { useResetAtom } from "jotai/utils";
import { Save, Undo2, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useRecordHotkeys } from "react-hotkeys-hook";

type ShortcutRowProps = {
  title: string;
  description?: string;
  settingsKey: keyof Settings["shortcuts"];
}

export const ShortcutRow = ({ title, description, settingsKey }: ShortcutRowProps) => {
  const [shortcut, setShortcut] = useAtom(settings.shortcuts[settingsKey]);
  const resetShortcut = useResetAtom(settings.shortcuts[settingsKey]);
  const [keys, { start, stop, isRecording }] = useRecordHotkeys();

  const reset = () => {
    resetShortcut()
  }

  const save = useCallback(() => {
    if (Array.from(keys).length > 0) {
      setShortcut(Array.from(keys).join("+"));
    }
    stop();
  }, [keys, setShortcut, stop])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRecording) {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stop, isRecording]);

  useEffect(() => {
    if (!isRecording) {
      return
    }
    if (Array.from(keys).length >= 3) {
      save()
    }
  }, [keys, stop, isRecording, save])

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-2">
          <div>{title}</div>
          {description && (
            <div className="text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right flex gap-2 justify-end items-center align-middle">
        <div className={clsx("border rounded-sm h-10 w-full min-w-48 hover:bg-accent font-mono text-lg flex justify-center items-center select-none", { "bg-accent border-2 italic": isRecording })} onClick={() => {
          if (isRecording) {
            save();
          } else {
            start();
          }
        }}>
          {!isRecording && replaceShortcutSymbols(shortcut)}
          {isRecording && Array.from(keys).length === 0 && "Recording..."}
          {isRecording && keys && replaceShortcutSymbols(keys)}
        </div>
        {!isRecording && (
          <Button variant="outline" size={"icon"} onClick={reset} className="h-10 w-10">
            <Undo2 className="h-4 w-4" />
          </Button>
        )}
        {isRecording && (
          <Button variant="outline" size={"icon"} onClick={stop} className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        )}
        {isRecording && (
          <Button variant="outline" size={"icon"} onClick={save} className="h-10 w-10">
            <Save className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}