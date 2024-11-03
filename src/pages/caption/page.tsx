import { CaptionView } from "@/components/caption/caption-view";
import { CaptionSaveToolbar } from "@/components/toolbars/caption-save-toolbar";
import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { CaptionEditorProvider } from "@/hooks/provider/caption-editor-provider";
import { CaptionClipboardProvider } from "@/hooks/provider/use-caption-clipboard-provider";
import { ImageListLayout } from "@/layouts/image-list-layout";

export default function Page() {
  return (
    <CaptionEditorProvider>
      <CaptionClipboardProvider>
        <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar, CaptionSaveToolbar]}>
          <CaptionView />
        </ImageListLayout>
      </CaptionClipboardProvider>
    </CaptionEditorProvider>
  );
}
