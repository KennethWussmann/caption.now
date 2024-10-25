import { CaptionView } from "@/components/caption/caption-view";
import { ImageListSidebar } from "@/components/sidebar/image-list-sidebar/image-list-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  useDatasetNavigation,
  useDatasetNavigationHotkeys,
} from "@/hooks/use-dataset-navigation";
import { useImageCaption } from "@/lib/image-caption-provider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Page() {
  const { imageFile } = useImageCaption();
  const { loadNextImage, loadPreviousImage, hasNextImage, hasPreviousImage } =
    useDatasetNavigation();
  useDatasetNavigationHotkeys();

  useEffect(() => {
    // Load the first image if no image is selected
    if (!imageFile) {
      loadNextImage();
    }
  }, [imageFile, loadNextImage]);

  return (
    <SidebarProvider>
      <Navigate to={`/caption/${imageFile?.name}`} />
      <ImageListSidebar side="left" />
      <SidebarInset>
        <header className="flex justify-between items-center h-16 shrink-0 px-4 border-b">
          <div className="flex items-center gap-2 ">
            <SidebarTrigger className="-ml-1" />
            {imageFile && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>Images</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{imageFile?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!hasPreviousImage()}
              onClick={loadPreviousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!hasNextImage()}
              onClick={loadNextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-4rem)]">
          <CaptionView />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
