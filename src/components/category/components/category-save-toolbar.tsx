import { Button } from "@/components/ui";
import { Save } from "lucide-react";
import { useCategoryEditor } from "../category-editor-provider";

export const CategorySaveToolbar = () => {
  const { isDirty, save } = useCategoryEditor()
  return (
    <Button variant={"outline"} disabled={!isDirty} onClick={save}><Save />Save</Button>
  );
};
