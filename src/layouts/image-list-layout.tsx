import { FC, ReactNode } from "react";
import { OllamaStatusNotification } from "@/components/common/ollama-status-notification";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { ImageListSidebar } from "@/components/sidebar/image-list-sidebar/image-list-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
} from "@/hooks/provider/image-navigation-provider";
import { useImageNavigation, useImageNavigationHotkeys } from "../hooks/provider/image-navigation-provider";
import { NoImageSelected } from "@/components/common/no-image-selected";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { ExportDialog } from "@/components/export/export-dialog";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { DeleteImageDialog } from "@/components/common/delete-image-dialog";

type ImageListLayoutProps = {
  children: ReactNode;
  toolbars?: FC[];
};

export const ImageListLayout = ({
  children,
  toolbars = [],
}: ImageListLayoutProps) => {
  const { currentImage } = useImageNavigation();
  useImageNavigationHotkeys();

  return (
    <SidebarProvider>
      <OnboardingDialog />
      <OllamaStatusNotification />
      <CommandPalette />
      <DeleteImageDialog />
      <ImageListSidebar side="left" />
      <SidebarInset>
        <header className="flex justify-between items-center h-16 shrink-0 px-3 border-b w-full">
          <div className="flex items-center gap-2 flex-1">
            <div><SidebarTrigger className="h-10 w-10" variant={"outline"} /></div>
            <div><SettingsDialog /></div>
            <div><ExportDialog /></div>
            {currentImage && (
              <>
                <Separator orientation="vertical" className="mx-2 h-10" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>Images</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentImage.filename}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {toolbars.map((toolbar, index) => {
              const Toolbar: FC = toolbar;
              return <Toolbar key={index} />;
            })}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
          {!currentImage && (<NoImageSelected />)}
          {currentImage && children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
