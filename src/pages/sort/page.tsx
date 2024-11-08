import { CategoryEditorProvider } from "@/components/category/category-editor-provider";
import { CategoryView } from "@/components/category/category-view";
import { CategorySaveToolbar } from "@/components/category/components/category-save-toolbar";
import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { ImageListLayout } from "@/layouts/image-list-layout";

export default function Page() {
  return (
    <CategoryEditorProvider>
      <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar, CategorySaveToolbar]}>
        <CategoryView />
      </ImageListLayout>
    </CategoryEditorProvider>
  );
}
