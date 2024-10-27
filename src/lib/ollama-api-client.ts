import { ChatRequest, GenerateRequest, Ollama } from "ollama/browser";
import { settings, settingsStore } from "./settings";

export const getClient = () => {
  const localStorageHost = localStorage.getItem("settings.ai.ollamaUrl");
  const host = localStorageHost
    ? JSON.parse(localStorageHost)
    : settingsStore.get(settings.ai.ollamaUrl);

  return new Ollama({
    host,
  });
};

export const getModels = async () => {
  const { models } = await getClient().list();
  return models;
};

export const pullModel = async (model: string) => {
  const response = await getClient().pull({
    model: model,
    stream: false,
  });
  return response;
};

export const generate = async (request: GenerateRequest) => {
  const { response } = await getClient().generate({
    ...request,
    stream: false,
  });
  return response;
};

export const chat = async (request: ChatRequest) => {
  const { message } = await getClient().chat({ ...request, stream: false });
  return message.content;
};

export const isOllamaOnline = async () => {
  try {
    await getModels();
    return true;
  } catch {
    return false;
  }
};
