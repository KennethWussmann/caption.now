import ollama, {
  ChatRequest,
  ChatResponse,
  GenerateRequest,
} from "ollama/browser";

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

export const chat = async (request: ChatRequest) => {
  const { message } = await ollama.chat({ ...request, stream: false });
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
