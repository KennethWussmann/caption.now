import { settings, Settings } from "@/lib/settings";
import { useAtom } from "jotai/react";

export const useFeatureEnabled = (
  feature: keyof Settings["featureToggles"]
) => {
  const [enabled] = useAtom(settings.featureToggles[feature]);
  return enabled;
};
