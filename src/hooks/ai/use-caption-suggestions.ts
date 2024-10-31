import { settings } from "@/lib/settings";
import { tryJSONParse } from "@/lib/utils";
import { useAtom } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useOllamaStatus } from "../use-ollama-status";
import { useImageCaption } from "@/hooks/provider/image-caption-provider";
import { useQuery } from "@tanstack/react-query";
import { chat } from "@/lib/ollama-api-client";
import { useHotkeys } from "react-hotkeys-hook";

const suggestionSchema = z.array(z.string());

export const useCaptionSuggestions = () => {
  const [visionModel] = useAtom(settings.ai.vision.model);
  const [userPromptTemplate] = useAtom(settings.ai.vision.userPrompt);
  const { isOnline } = useOllamaStatus();
  const { imageFile, caption, addPart } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
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
    enabled: isOnline && !!imageFile?.base64 && !isDebounced,
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

  const applySuggestion = (suggestion: string) => {
    addPart({
      id: Math.random().toString(),
      text: suggestion,
    });
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
  }, [imageFile]);

  useEffect(() => {
    setDebounced(true);
    const timeout = setTimeout(() => {
      setDebounced(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [imageFile, setDebounced]);

  return {
    suggestions,
    isLoading: isLoading || isRefetching,
    removeSuggestion,
    refetch,
    applySuggestion,
  };
};
