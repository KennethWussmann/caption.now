import { Card } from "@/components/ui";
import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { useImageCaption } from "@/lib/image-caption-provider";
import { generate } from "@/lib/ollama-api-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const CaptionPreviewAI = () => {
  const { isOnline } = useOllamaStatus();
  const { caption } = useImageCaption();
  const text = useMemo(() => {
    return caption.parts.map((part) => part.text.trim()).join(". ") + ".";
  }, [caption.parts]);
  const isEmpty = caption.parts.length === 0;

  const { data: fullCaption, isLoading } = useQuery({
    enabled: !isEmpty && isOnline,
    queryKey: ["caption", text],
    queryFn: () =>
      generate({
        model: "mistral-small:latest",
        prompt: text,
        system:
          "You are an AI prompt refining assistant. The user is giving you a rough prompt. Sometimes only containing tags, sometimes containing entire sentences. The order of the sentences is important. You are asked to understand and combine the sentences logically and grammatically. You are asked to generate a refined prompt that is more grammatically correct. You shall not add any details that the user didn't mention. Write the prompt mainly in sentences that always describe one subject or aspect. Start with the medium, rough description of the subjects, more detailed description of the subjects, situation and how they interact and end the prompt with the background, style or atmosphere of the image. Phrase it like an AI image prompt, but leave out starting phrases like 'Generate', 'Imagine'. If a word in the users message starts with \"en:\", you are asked to translate the word from which ever language it might be into english. Generally, use simple everyday language that everyone would understand. Only reply with the refined prompt, do not add any additional text.",
      }),
    staleTime: Infinity,
  });

  if (!isOnline) {
    return (
      <Card className="p-1 px-2 italic text-muted-foreground text-center">
        Ollama is offline
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="p-1 px-2 italic text-muted-foreground text-center">
        No caption
      </Card>
    );
  }

  if (!fullCaption || isLoading) {
    return (
      <Card className="p-1 px-2 italic text-muted-foreground text-center">
        Thinking ...
      </Card>
    );
  }
  return (
    <Card className="p-1 px-2 max-h-60 overflow-y-scroll">{fullCaption}</Card>
  );
};
