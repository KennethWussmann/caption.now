import { useOllamaStatus } from "@/hooks/use-ollama-status";
import { useToast } from "@/hooks/use-toast";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";

export const OllamaStatusNotification = () => {
  const { toast } = useToast();
  const [isOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const { isOnline } = useOllamaStatus();
  const [wasPreviouslyOnline, setPreviouslyOnline] = useState(isOnline);

  useEffect(() => {
    if (!isOllamaEnabled) {
      return;
    }
    if (wasPreviouslyOnline === isOnline) {
      return;
    }
    if (isOnline) {
      toast({
        title: "Ollama is online!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Ollama is offline",
        description: "Some features may not be available.",
        duration: 5000,
      });
    }
    setPreviouslyOnline(isOnline);
  }, [isOnline, isOllamaEnabled, toast, wasPreviouslyOnline]);

  return null;
};
