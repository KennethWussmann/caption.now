import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui";
import { useDatasetNavigation } from "@/hooks/use-dataset-navigation";

export const ImageNavigationToolbar = () => {
  const { loadNextImage, loadPreviousImage, hasNextImage, hasPreviousImage } =
    useDatasetNavigation();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasPreviousImage}
        onClick={loadPreviousImage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasNextImage}
        onClick={loadNextImage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};
