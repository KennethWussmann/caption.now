import { ImageNavigationToolbar } from "@/components/toolbars/image-navigation-toolbar";
import { LensSettingsToolbar } from "@/components/toolbars/lens-settings-toolbar";
import { ImageListLayout } from "@/layouts/image-list-layout";

export default function Page() {
  return (
    <ImageListLayout toolbars={[LensSettingsToolbar, ImageNavigationToolbar]}>
      <></>
    </ImageListLayout>
  );
}
