import { atomWithStorage } from "jotai/utils";

export const settings = {
  appearance: {
    theme: atomWithStorage("settings.appearance.theme", "system"),
    skipSetupSummary: atomWithStorage(
      "settings.appearance.skipSetupSummary",
      false
    ),
  },
  ai: {
    ollamaEnabled: atomWithStorage("settings.ai.ollamaEnabled", true),
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
      systemPrompt: atomWithStorage(
        "settings.ai.caption.systemPrompt",
        'You are an AI prompt refining assistant. The user is giving you a rough prompt. Sometimes only containing tags, sometimes containing entire sentences. The order of the sentences is important. You are asked to understand and combine the sentences logically and grammatically. You are asked to generate a refined prompt that is more grammatically correct. You shall not add any details that the user didn\'t mention. Write the prompt mainly in sentences that always describe one subject or aspect. Start with the medium, rough description of the subjects, more detailed description of the subjects, situation and how they interact and end the prompt with the background, style or atmosphere of the image. Phrase it like an AI image prompt, but leave out starting phrases like "Generate", "Imagine". If a word in the users message starts with "en:", you are asked to translate the word from which ever language it might be into english. Generally, use simple everyday language that everyone would understand. Only reply with the refined prompt, do not add any additional text.'
      ),
    },
    vision: {
      _recommendedModel: "cheese",
      model: atomWithStorage("settings.ai.vision.model", "llava:latest"),
      systemPrompt: atomWithStorage("settings.ai.vision.systemPrompt", "TODO"),
    },
  },
};

export const resetLocalStorage = async () => {
  for (const key in localStorage) {
    localStorage.removeItem(key);
  }
};
