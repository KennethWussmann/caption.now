import { isOllamaOnline } from "@/lib/ollama-api-client";
import { useCallback, useEffect, useState } from "react";

type StatusResponse = {
  isOnline: boolean;
  isLoading: boolean;
  status: "online" | "offline" | "checking";
  recheck: VoidFunction;
};

export const useOllamaStatus = (): StatusResponse => {
  const [isOnline, setOnline] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const recheck = useCallback(async () => {
    setLoading(true);
    setOnline(await isOllamaOnline());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    recheck();
    const interval = setInterval(() => {
      recheck();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [recheck]);

  return {
    isOnline,
    isLoading,
    recheck,
    status: isLoading ? "checking" : isOnline ? "online" : "offline",
  };
};
