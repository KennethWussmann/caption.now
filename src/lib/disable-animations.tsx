import { settings } from "@/lib/settings";
import { MotionGlobalConfig } from "framer-motion";
import { useAtom } from "jotai/react";
import { useEffect } from "react";

export const DisableAnimations = () => {
  const [animationsDisabled] = useAtom(settings.appearance.disableAnimations);

  useEffect(() => {
    MotionGlobalConfig.skipAnimations = animationsDisabled;
  }, [animationsDisabled]);

  return null;
};
