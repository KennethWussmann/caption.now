import { CaptionPreviewAI } from "./caption-preview-ai";
import { CaptionPreview } from "./caption-preview";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { CaptionSuggestionsAI } from "./caption-suggestions-ai";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { useImageCaption } from "@/hooks/provider/image-caption-provider";

export const CaptionListFooter = () => {
  const [isOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const [strategy] = useAtom(settings.caption.strategy);
  const { isOnline } = useOllamaStatus();
  const { isDirty } = useImageCaption();
  return (
    <div>
      {isOllamaEnabled && isOnline && <CaptionSuggestionsAI />}
      {isOllamaEnabled && isOnline && strategy === "ai" && isDirty ? (
        <CaptionPreviewAI />
      ) : (
        <CaptionPreview />
      )}
    </div>
  );
};
