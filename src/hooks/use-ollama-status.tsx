import { isOllamaOnline, isOllamaReachable } from "@/lib/ollama-api-client";
import { settings } from "@/lib/settings";
import { useAtom } from "jotai/react";
import { useCallback, useEffect, useState } from "react";

type StatusResponse = {
  isOnline: boolean;
  isLoading: boolean;
  isReachable: boolean;
  status: "online" | "offline" | "checking";
  recheck: VoidFunction;
};

export const useOllamaStatus = (): StatusResponse => {
  const [isOllamaEnabled] = useAtom(settings.ai.ollamaEnabled);
  const [ollamaUrl] = useAtom(settings.ai.ollamaUrl);
  const [isOnline, setOnline] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const isReachable = isOllamaReachable(ollamaUrl);

  const recheck = useCallback(async () => {
    if (!isOllamaEnabled) {
      setOnline(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOnline(await isOllamaOnline());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isOllamaEnabled]);

  useEffect(() => {
    if (!isOllamaEnabled) {
      setOnline(false);
      return;
    }
    recheck();
    const interval = setInterval(() => {
      recheck();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [recheck, isOllamaEnabled]);

  return {
    isOnline,
    isLoading,
    recheck,
    status: isLoading ? "checking" : isOnline ? "online" : "offline",
    isReachable,
  };
};
