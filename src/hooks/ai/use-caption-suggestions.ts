import { settings } from "@/lib/settings";
import { tryJSONParse } from "@/lib/utils";
import { useAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useOllamaStatus } from "../use-ollama-status";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";
import { useHotkeys } from "react-hotkeys-hook";
import { useCaptionEditor } from "../provider/caption-editor-provider";
import { useImageNavigation } from "../provider/image-navigation-provider";
import { useImageBase64 } from "../use-image-base64";

const suggestionSchema = z.array(z.string());

export const useCaptionSuggestions = () => {
  const [separator] = useAtom(settings.caption.separator);
  const [visionModel] = useAtom(settings.ai.vision.model);
  const [userPromptTemplate] = useAtom(settings.ai.vision.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { parts, addPart } = useCaptionEditor();
  const {currentImage} = useImageNavigation()
  const currentImageAsBase64 = useImageBase64(currentImage)
  const text = useMemo(() => {
    return parts.map((part) => part.text.trim()).join(separator);
  }, [parts, separator]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDebounced, setDebounced] = useState(true);

  useHotkeys("ctrl+1", () => applySuggestionKeyboardShortcut(0), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+2", () => applySuggestionKeyboardShortcut(1), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+3", () => applySuggestionKeyboardShortcut(2), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+4", () => applySuggestionKeyboardShortcut(3), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+5", () => applySuggestionKeyboardShortcut(4), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+6", () => applySuggestionKeyboardShortcut(5), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+7", () => applySuggestionKeyboardShortcut(6), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+8", () => applySuggestionKeyboardShortcut(7), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys("ctrl+9", () => applySuggestionKeyboardShortcut(8), {
    enableOnFormTags: ["INPUT"],
  });

  const {
    data: aiSuggestions,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: isOnline && !!currentImageAsBase64 && !isDebounced,
    queryKey: ["vision", currentImageAsBase64 ?? "", text],
    queryFn: () =>
      chat({
        model: visionModel,
        messages: [
          {
            role: "user",
            content: userPromptTemplate.replace("%text%", text),
            images: [currentImageAsBase64 ?? ""],
          },
        ],
      }),
    staleTime: Infinity,
  });

  const removeSuggestion = (suggestion: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const applySuggestion = (suggestion: string) => {
    addPart(suggestion);
    removeSuggestion(suggestion);
  };

  const applySuggestionKeyboardShortcut = (index: number) => {
    if (index >= 0 && index < suggestions.length) {
      applySuggestion(suggestions[index]);
    }
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
  }, [currentImage]);

  useEffect(() => {
    setDebounced(true);
    const timeout = setTimeout(() => {
      setDebounced(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentImage, setDebounced]);

  return {
    suggestions,
    isLoading: isLoading || isRefetching,
    removeSuggestion,
    refetch,
    applySuggestion,
  };
};
