import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useOllamaStatus } from "../use-ollama-status";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";
import { useImageNavigation } from "../provider/image-navigation-provider";

export const useCaptionRefiner = ({
  initialValue,
  simplePreview,
  skip,
}: {
  initialValue?: string | null;
  simplePreview?: string;
  skip?: boolean;
} = {}) => {
  const [captionModel] = useAtom(settings.ai.caption.model);
  const [userPromptTemplate] = useAtom(settings.ai.caption.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { currentImage } = useImageNavigation();
  const [captionSuggestion, setCaptionSuggestion] = useState<string | null>(
    initialValue ?? null
  );

  const {
    data: aiResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: isOnline && !skip,
    queryKey: ["caption", simplePreview],
    queryFn: () =>
      chat({
        model: captionModel,
        messages: [
          {
            role: "user",
            content: userPromptTemplate.replace("%text%", simplePreview ?? ""),
          },
        ],
      }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!aiResponse || aiResponse.length < 3) {
      return;
    }
    setCaptionSuggestion(aiResponse);
  }, [aiResponse]);

  useEffect(() => {
    setCaptionSuggestion(null);
  }, [currentImage?.id]);

  return {
    captionSuggestion,
    isLoading: isLoading || isRefetching,
    refetch: () => {
      refetch();
    },
  };
};
