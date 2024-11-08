import { ShortcutText } from "@/components/common/shortcut-text"
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui"
import { EllipsisVertical, Trash } from "lucide-react"
import { useCategoryEditor } from "../category-editor-provider";

export const CategoryListDropdown = () => {
  const { clearCategories } = useCategoryEditor();
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}><EllipsisVertical /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={clearCategories} >
          <Trash />
          <span>Clear</span>
          <DropdownMenuShortcut>
            <ShortcutText settingsKey="clearCategories" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}