import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { CaptionPart } from "@/lib/types";
import { useCaptionRefiner } from "./ai/use-caption-refiner";
import { useEffect, useState } from "react";
import { useOllamaStatus } from "./use-ollama-status";

export const useCaptionPreview = ({
  parts,
  initialValue
}: {
  parts: CaptionPart[];
  initialValue?: string;
}) => {
  const [separator] = useAtom(settings.caption.separator);
  const [endWithSeparator] = useAtom(settings.caption.endWithSeparator);
  const [strategy] = useAtom(settings.caption.strategy);
  const { isOnline } = useOllamaStatus();
  const [ollamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const useAi = strategy === "ai" && isOnline && ollamaEnabled;
  const isEmpty = parts.length === 0;
  const [preview, setPreview] = useState<string | null>(null);

  let finalText = parts
    .map((part) => part.text.trim())
    .join(separator)
    .trim();
  if (endWithSeparator && !finalText.endsWith(separator.trim()) && parts.length > 0) {
    finalText += separator;
  }
  const { captionSuggestion, isLoading, refetch } = useCaptionRefiner({
    simplePreview: finalText,
    initialValue,
    skip: isEmpty || !useAi,
  });

  useEffect(() => {
    if (useAi) {
      setPreview(captionSuggestion?.trim() ?? null);
    } else {
      setPreview(finalText.trim());
    }
  }, [captionSuggestion, finalText, useAi])

  return {
    isEmpty,
    preview,
    simple: {
      preview: finalText
    },
    ai: {
      preview: captionSuggestion, isLoading, refetch
    }
  }
}