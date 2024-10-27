import { CaptionPreviewAI } from "./caption-preview-ai";
import { CaptionPreview } from "./caption-preview";
import { useAtom } from "jotai/react";
import { settings } from "@/lib/settings";
import { CaptionSuggestionsAI } from "./caption-suggestions-ai";
import { useOllamaStatus } from "@/hooks/use-ollama-status";

export const CaptionListFooter = () => {
  const [isOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const { isOnline } = useOllamaStatus();
  return (
    <div>
      {isOllamaEnabled && isOnline && <CaptionSuggestionsAI />}
      {isOllamaEnabled && isOnline ? <CaptionPreviewAI /> : <CaptionPreview />}
    </div>
  );
};
