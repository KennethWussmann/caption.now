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

const useCaptionSuggestionsShortcuts = (
  applySuggestion: (index: number) => void
) => {
  const [modifier] = useAtom(settings.shortcuts.applySuggestionModifier);

  useHotkeys([modifier, "1"].join("+"), () => applySuggestion(0), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "2"].join("+"), () => applySuggestion(1), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "3"].join("+"), () => applySuggestion(2), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "4"].join("+"), () => applySuggestion(3), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "5"].join("+"), () => applySuggestion(4), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "6"].join("+"), () => applySuggestion(5), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "7"].join("+"), () => applySuggestion(6), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "8"].join("+"), () => applySuggestion(7), {
    enableOnFormTags: ["INPUT"],
  });
  useHotkeys([modifier, "9"].join("+"), () => applySuggestion(8), {
    enableOnFormTags: ["INPUT"],
  });
};

export const useCaptionSuggestions = () => {
  const [separator] = useAtom(settings.caption.separator);
  const [visionModel] = useAtom(settings.ai.vision.model);
  const [userPromptTemplate] = useAtom(settings.ai.vision.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { parts, addPart } = useCaptionEditor();
  const { currentImage } = useImageNavigation();
  const currentImageAsBase64 = useImageBase64(currentImage);
  const text = useMemo(() => {
    return parts.map((part) => part.text.trim()).join(separator);
  }, [parts, separator]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDebounced, setDebounced] = useState(true);
  useCaptionSuggestionsShortcuts((i) => applySuggestionKeyboardShortcut(i));

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
  }, [currentImage?.id]);

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
