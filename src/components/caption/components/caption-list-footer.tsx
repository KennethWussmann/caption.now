import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { CaptionPreviewAI } from "./caption-preview-ai";
import { CaptionPreview } from "./caption-preview";

export const CaptionListFooter = () => {
  const { isOnline } = useOllamaStatus();
  return (
    <div>
      <h1 className="mb-2 mt-2">Preview</h1>
      {isOnline ? <CaptionPreviewAI /> : <CaptionPreview />}
    </div>
  );
};
