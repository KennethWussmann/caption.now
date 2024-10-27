import { settings } from "@/lib/settings";
import { tryJSONParse } from "@/lib/utils";
import { useAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useOllamaStatus } from "../use-ollama-status";
import { useImageCaption } from "@/lib/image-caption-provider";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";

const suggestionSchema = z.array(z.string());

export const useCaptionSuggestions = () => {
  const [visionModel] = useAtom(settings.ai.vision.model);
  const [userPromptTemplate] = useAtom(settings.ai.vision.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { imageFile, caption } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    data: aiSuggestions,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: isOnline && !!imageFile?.base64,
    queryKey: ["vision", imageFile?.base64 ?? "", text],
    queryFn: () =>
      chat({
        model: visionModel,
        messages: [
          {
            role: "user",
            content: userPromptTemplate.replace("%text%", text),
            images: [imageFile?.base64 ?? ""],
          },
        ],
      }),
    staleTime: Infinity,
  });

  const removeSuggestion = (suggestion: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  useEffect(() => {
    const rawResponse = aiSuggestions
      ?.replace("```json", "")
      ?.replace("```", "")
      ?.trim();

    const jsonResponse = rawResponse ? tryJSONParse(rawResponse) : null;
    const arrayResponse = suggestionSchema.safeParse(jsonResponse);

    if (jsonResponse?.length > 0 && arrayResponse.success) {
      setSuggestions(arrayResponse.data);
    }
  }, [aiSuggestions]);

  useEffect(() => {
    setSuggestions([]);
  }, [imageFile]);

  return {
    suggestions,
    isLoading: isLoading || isRefetching,
    removeSuggestion,
    refetch,
  };
};
