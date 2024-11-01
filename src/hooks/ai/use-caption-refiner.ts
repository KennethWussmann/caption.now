import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { useOllamaStatus } from "../use-ollama-status";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";
import { useCaptionEditor } from "../provider/caption-editor-provider";
import { useImageNavigation } from "../provider/image-navigation-provider";

export const useCaptionRefiner = ({
  initialValue,
  skip,
}: {
  initialValue?: string | null;
  skip?: boolean;
} = {}) => {
  const [separator] = useAtom(settings.caption.separator);
  const [captionModel] = useAtom(settings.ai.caption.model);
  const [userPromptTemplate] = useAtom(settings.ai.caption.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { parts } = useCaptionEditor();
  const { currentImage } = useImageNavigation()
  const text = useMemo(() => {
    return parts.map((part) => part.text.trim()).join(separator);
  }, [parts, separator]);
  const [captionSuggestion, setCaptionSuggestion] = useState<string | null>(
    initialValue ?? null
  );

  const isEmpty = parts.length === 0;

  const {
    data: aiResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: isOnline && !isEmpty && !skip,
    queryKey: ["caption", text],
    queryFn: () =>
      chat({
        model: captionModel,
        messages: [
          {
            role: "user",
            content: userPromptTemplate.replace("%text%", text),
          },
        ],
      }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!aiResponse || aiResponse.length < 3 || parts.length === 0) {
      return;
    }
    setCaptionSuggestion(aiResponse);
  }, [aiResponse, parts.length]);

  useEffect(() => {
    setCaptionSuggestion(null);
  }, [currentImage]);

  return {
    captionSuggestion,
    isLoading: isLoading || isRefetching,
    refetch: () => {
      if (parts.length === 0) {
        return;
      }
      refetch();
    },
  };
};
