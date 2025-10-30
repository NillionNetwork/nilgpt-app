export const LLM = {
  gemma: {
    class: 'gemma',
    model: 'google/gemma-3-27b-it',
    temperature: 0.2,
    maxTokens: 10000,
    infoLink: 'https://huggingface.co/google/gemma-3-27b-it',
  },
  gpt: {
    class: 'gpt',
    model: 'openai/gpt-oss-20b',
    temperature: 0.95,
    maxTokens: 10000,
    infoLink: 'https://huggingface.co/openai/gpt-oss-20b',
  },
  llama: {
    class: 'llama',
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    temperature: 0.2,
    maxTokens: 1100,
    infoLink: 'https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct',
  },
} as const;

export const DEFAULT_MODEL_CONFIG = LLM.gpt;
export const DEFAULT_MODEL = DEFAULT_MODEL_CONFIG.model;

export type TLLMName = (typeof LLM)[keyof typeof LLM]['model'];
export const getModelConfig = (model: TLLMName) => {
  return Object.values(LLM).find((m) => m.model === model) || DEFAULT_MODEL_CONFIG;
};
