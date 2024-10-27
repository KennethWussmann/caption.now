import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { useOllamaStatus } from "../use-ollama-status";
import { useImageCaption } from "@/lib/image-caption-provider";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";

export const useCaptionRefiner = () => {
  const [captionModel] = useAtom(settings.ai.caption.model);
  const [userPromptTemplate] = useAtom(settings.ai.caption.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { imageFile, caption } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
  const [captionSuggestion, setCaptionSuggestion] = useState<string | null>(
    null
  );

  const isEmpty = caption.parts.length === 0;

  const {
    data: aiResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: isOnline || !isEmpty,
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
    if (!aiResponse || aiResponse.length < 3 || caption.parts.length === 0) {
      return;
    }
    setCaptionSuggestion(aiResponse);
  }, [aiResponse]);

  useEffect(() => {
    setCaptionSuggestion(null);
  }, [imageFile]);

  return {
    captionSuggestion,
    isLoading: isLoading || isRefetching,
    refetch: () => {
      if (caption.parts.length === 0) {
        return;
      }
      refetch();
    },
  };
};
