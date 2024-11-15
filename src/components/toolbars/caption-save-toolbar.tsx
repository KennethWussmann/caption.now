import { Button } from "@/components/ui";
import { useCaptionEditor } from "@/components/caption/caption-editor-provider";
import { Save } from "lucide-react";

export const CaptionSaveToolbar = () => {
  const { isDirty, save } = useCaptionEditor()
  return (
    <Button variant={"outline"} disabled={!isDirty} onClick={save}><Save />Save</Button>
  );
};
