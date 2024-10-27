import { atomWithStorage } from "jotai/utils";
import { createStore } from "jotai/vanilla";
import { atomWithZod } from "./zod-atom";
import { z } from "zod";

export const settingsStore = createStore();

export const settings = {
  onboardingCompleted: atomWithStorage("settings.onboardingCompleted", false),
  appearance: {
    theme: atomWithStorage("settings.appearance.theme", "system"),
    skipSetupSummary: atomWithStorage(
      "settings.appearance.skipSetupSummary",
      false
    ),
  },
  caption: {
    strategy: atomWithZod(
      "settings.tools.caption.strategy",
      "ai",
      z.union([z.literal("ai"), z.literal("separator")])
    ),
    separator: atomWithStorage("settings.tools.caption.separator", ". "),
    endWithSeparator: atomWithStorage(
      "settings.tools.caption.endWithSeparator",
      true
    ),
  },
  tools: {
    lens: {
      enabled: atomWithStorage("settings.tools.lens.enabled", true),
      zoomFactor: atomWithStorage("settings.tools.lens.zoomFactor", 3),
      size: atomWithStorage("settings.tools.lens.size", 300),
    },
  },
  ai: {
    ollamaEnabled: atomWithStorage("settings.ai.ollamaEnabled", false),
    ollamaUrl: atomWithStorage(
      "settings.ai.ollamaUrl",
      "http://127.0.0.1:11434"
    ),
    caption: {
      _recommendedModel: "mistral-small",
      model: atomWithStorage(
        "settings.ai.caption.model",
        "mistral-small:latest"
      ),
      userPrompt: atomWithStorage(
        "settings.ai.caption.userPrompt",
        `You are an AI prompt refining assistant. I'm giving you a rough prompt. Sometimes only containing tags, sometimes containing entire sentences. The order of the sentences is important. You are asked to understand and combine the sentences logically and grammatically. You are asked to generate a refined prompt that is more grammatically correct. You shall not add any details that I didn't mention. Write the prompt mainly in sentences that always describe one subject or aspect. Start with the medium, rough description of the subjects, more detailed description of the subjects, situation and how they interact and end the prompt with the background, style or atmosphere of the image. Phrase it like an AI image prompt, but leave out starting phrases like "Generate", "Imagine". If a word in my prompt starts with "en:", you are asked to translate the word from which ever language it might be into English and integrate it seamlessly into the sentence. Generally, use simple everyday language that everyone would understand. Only reply with the refined prompt, do not add any additional text.
        
        My prompt: %text%`
      ),
    },
    vision: {
      _recommendedModel: "llava",
      model: atomWithStorage("settings.ai.vision.model", "llava:latest"),
      userPrompt: atomWithStorage(
        "settings.ai.vision.userPrompt",
        `You are an AI Image Captioning Assistant. Your role consists of analyzing images and generating captions for them. The captions should be short and precise in everyday language. You are working together with me, so I may also give you clues about what I see on the image. Use the clues to refine what you see. Take my clues into account. You don't write a full caption for the image, you just offer me some suggestions for phrases and sentences that you think should be part of the caption. Prioritze new ideas higher than aspects that are already covered in my clues. Your suggestions should capture different aspects of the image, don't include similar suggestions multiple times. Don't only focus on the center subject. Also consider the background and other objects in the image. Describe how the objects interact with each other.
        
        Please generate between 3 and 5 suggestions for the image. Reply in a JSON top-level array of strings. Your reply must be a valid JSON array of strings.

        My clues: %text%`
      ),
    },
  },
};

export const resetLocalStorage = async () => {
  for (const key in localStorage) {
    localStorage.removeItem(key);
  }
};
