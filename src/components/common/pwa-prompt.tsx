import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "../ui";
import { RefreshCw } from "lucide-react";

export const PWAPrompt = () => {
  const { toast } = useToast();
  const { updateServiceWorker } = useRegisterSW({
    onRegistered: (r) => {
      console.log("Service worker registered:", r);
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError: (err) => {
      console.error("Failed to register service worker", err);
    },
    onOfflineReady: () => {
      console.error("Ofline ready");
      toast({
        title: "Work offline",
        description: "QuickLabel is ready to work offline",
        duration: 5000,
      });
    },
    onNeedRefresh: () => {
      console.error("New update available. Refresh to update.");
      toast({
        title: "Update available",
        description: "A new version of QuickLabel is available",
        duration: Infinity,
        action: (
          <Button
            onClick={() => {
              updateServiceWorker(true);
            }}
          >
            <RefreshCw />
            Refresh
          </Button>
        ),
      });
    },
  });

  return null;
};
