import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { ArrowUp, Pencil, X } from "lucide-react";

export const EditBanner = () => {
  return (
    <div className="flex gap-2 justify-between items-center  p-1 px-2 rounded-t-md border border-input border-b-0 border-solid bg-secondary">
      <div className="flex gap-2 items-center text-xs text-muted-foreground">
        <Pencil className="w-4 h-4" />
        You are editing
        <div className="italic">"Cute cat sleeping on couch"</div>
      </div>
      <X className="w-4 h-4 hover:cursor-pointer rounded-sm" />
    </div>
  );
};

export const CaptionInput = ({ editing = true }: { editing?: boolean }) => {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex w-full items-center space-x-2">
        <div className="w-full">
          {editing && <EditBanner />}
          <Input
            type="text"
            className={clsx("h-14 pl-4 text-xl", { "rounded-t-none": editing })}
            placeholder={editing ? "Edit caption ..." : "Write a sentence ..."}
          />
        </div>
      </div>
      <div className="flex gap-1 text-xs text-muted-foreground">
        Hit <kbd>Enter</kbd> to submit{" "}
        {editing && (
          <>
            or <kbd>Escape</kbd>
            to cancel editing
          </>
        )}
        {!editing && (
          <>
            or <ArrowUp className="h-4 w-4" />
            to edit last caption
          </>
        )}
      </div>
    </div>
  );
};
