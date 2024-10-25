import { Separator } from "@/components/ui/separator";
import { Card } from "../../ui/card";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

const CaptionListItem = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="flex justify-between align-middle items-center gap-2 p-1 pl-4">
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-30" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Trash />
              <span>Delete</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              <span>Edit</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export const CaptionList = () => {
  return (
    <div className="p-4 border-l ml-2 h-full flex flex-col">
      <h1 className="mb-2">Caption</h1>
      <div
        className="flex flex-col overflow-y-auto gap-1 mb-4"
        style={{ flex: "1 1 0", minHeight: 0 }}
      >
        <CaptionListItem>Cute cat sleeping on couch</CaptionListItem>
        <CaptionListItem>Cute cat sleeping on couch</CaptionListItem>
        <CaptionListItem>Cute cat sleeping on couch</CaptionListItem>
      </div>
      <div>
        <Separator className="mb-2" />
        <h1 className="mb-2">Preview</h1>
        <Card className="p-1 px-2">
          <h2>
            Cute cat sleeping on couch, Living room in backgroundCute cat
            sleeping on couch, Living room in backgroundCute cat sleeping on
            couch, Living room in background
          </h2>
        </Card>
      </div>
    </div>
  );
};
