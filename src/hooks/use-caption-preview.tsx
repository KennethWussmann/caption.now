import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { CaptionPart } from "@/lib/types";
import { useCaptionRefiner } from "./ai/use-caption-refiner";
import { useEffect, useState } from "react";

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
  const isEmpty = parts.length === 0;
  const [preview, setPreview] = useState<string | null>(null);

  let finalText = parts
    .map((part) => part.text.trim())
    .join(separator)
    .trim();
  if (endWithSeparator && !finalText.endsWith(separator.trim())) {
    finalText += separator;
  }
  const { captionSuggestion, isLoading, refetch } = useCaptionRefiner({
    simplePreview: finalText,
    initialValue,
    skip: isEmpty || strategy !== "ai",
  });

  useEffect(() => {
    if (strategy === "separator") {
      setPreview(finalText.trim());
    } else if (strategy === "ai") {
      setPreview(captionSuggestion?.trim() ?? null);
    }
  }, [captionSuggestion, finalText, strategy])

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