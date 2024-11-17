import { CaptionView } from "@/components/caption/caption-view";
import { CaptionSaveToolbar } from "@/components/toolbars/caption-save-toolbar";
import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { CaptionEditorProvider } from "@/components/caption/caption-editor-provider";
import { CaptionClipboardProvider } from "@/hooks/provider/use-caption-clipboard-provider";
import { ImageListLayout } from "@/layouts/image-list-layout";
import { SearchCurrentCaptionDialogProvider } from "@/components/search/search-current-caption-dialog-provider";
import { SearchCurrentCaptionDialog } from "@/components/search/search-current-caption-dialog";

export default function Page() {
  return (
    <CaptionEditorProvider>
      <CaptionClipboardProvider>
        <SearchCurrentCaptionDialogProvider>
          <SearchCurrentCaptionDialog />
          <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar, CaptionSaveToolbar]}>
            <CaptionView />
          </ImageListLayout>
        </SearchCurrentCaptionDialogProvider>
      </CaptionClipboardProvider>
    </CaptionEditorProvider>
  );
}
