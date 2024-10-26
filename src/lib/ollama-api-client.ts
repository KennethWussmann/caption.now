import ollama, { GenerateRequest } from "ollama/browser";

export const getModels = async () => {
  const { models } = await ollama.list();
  return models;
};

export const pullModel = async (model: string) => {
  const response = await ollama.pull({
    model: model,
    stream: false,
  });
  return response;
};

export const generate = async (request: GenerateRequest) => {
  const { response } = await ollama.generate({ ...request, stream: false });
  return response;
};

export const isOllamaOnline = async () => {
  try {
    await getModels();
    return true;
  } catch {
    return false;
  }
};
