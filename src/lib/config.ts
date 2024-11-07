import { z } from "zod";
import { productName } from "./constants";

const configSchema = z
  .object({
    VITE_APP_VERSION: z.string().default("develop"),
    VITE_IMPRINT_URL: z.string().optional(),
    VITE_PRIVACY_URL: z.string().optional(),
    VITE_DEMO_MODE: z
      .string()
      .transform((v) => v?.toLowerCase() === "true")
      .optional(),
  })
  .transform((v) => ({
    appVersion: v.VITE_APP_VERSION,
    imprintUrl: v.VITE_IMPRINT_URL,
    privacyUrl: v.VITE_PRIVACY_URL,
    demoMode: v.VITE_DEMO_MODE,

    githubURL: `https://github.com/KennethWussmann/${productName}`,
  }));

const configResult = configSchema.safeParse(import.meta.env);

if (!configResult.success) {
  console.error("Failed to parse config", {
    env: import.meta.env,
    errors: configResult.error.errors,
  });
  throw configResult.error;
}

export const config = configResult.data;
