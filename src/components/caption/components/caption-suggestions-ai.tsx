import { Card } from "@/components/ui";
import { AnimatedGroup } from "@/components/ui/animation/animated-group";
import { useCaptionSuggestions } from "@/hooks/ai/use-caption-suggestions";
import { useImageCaption } from "@/lib/image-caption-provider";
import { LoaderCircle, RefreshCw } from "lucide-react";

export const CaptionSuggestionsAI = () => {
  const { addPart } = useImageCaption();
  const { suggestions, removeSuggestion, isLoading, refetch } =
    useCaptionSuggestions();

  return (
    <div className="my-2 py-2">
      <div className="flex flex-row gap-2 mb-2 font-semibold items-center">
        Suggestions{" "}
        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {!isLoading && (
          <RefreshCw className="h-4 w-4" onClick={() => refetch()} />
        )}
      </div>

      {suggestions.length === 0 && (
        <Card className="p-1 px-2 italic text-muted-foreground text-center">
          No suggestions
        </Card>
      )}

      {suggestions.length > 0 && (
        <AnimatedGroup preset="blur-slide" className="flex flex-col gap-2">
          {suggestions.map((text) => (
            <Card
              key={text}
              className="p-2 px-4 hover:bg-muted cursor-pointer"
              onClick={() => {
                removeSuggestion(text);
                addPart({
                  id: Math.random().toString(),
                  text,
                });
              }}
            >
              {text}
            </Card>
          ))}
        </AnimatedGroup>
      )}
    </div>
  );
};
