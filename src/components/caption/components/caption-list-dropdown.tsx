import { ShortcutText } from "@/components/common/shortcut-text"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui"
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { useCaptionClipboard } from "@/hooks/provider/use-caption-clipboard-provider";
import { ClipboardCopy, ClipboardPaste, EllipsisVertical, Trash } from "lucide-react"

export const CaptionListDropdown = () => {
  const { parts, clearParts } = useCaptionEditor();
  const { copy, paste, hasContent } = useCaptionClipboard();
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}><EllipsisVertical /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={parts.length === 0} onClick={copy}>
          <ClipboardCopy />
          <span>Copy</span>
          <DropdownMenuShortcut>
            <ShortcutText settingsKey="copyCaptionParts" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!hasContent} onClick={paste}>
          <ClipboardPaste />
          <span>Paste</span>
          <DropdownMenuShortcut>
            <ShortcutText settingsKey="pasteCaptionParts" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clearParts} >
          <Trash />
          <span>Clear</span>
          <DropdownMenuShortcut>
            <ShortcutText settingsKey="clearCaption" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}