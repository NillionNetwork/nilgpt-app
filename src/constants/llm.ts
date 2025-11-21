import { TLlmName, TPersona } from '@/types/chat';

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

export const PROMPT_SUGGESTIONS: Record<
  TPersona,
  { emoji: string; prompt: string }[]
> = {
  'personal-assistant': [
    { emoji: '📅', prompt: 'Help me plan my week' },
    { emoji: '📧', prompt: 'Draft an email for me' },
    { emoji: '📝', prompt: 'I need an agenda for my meeting' },
  ],
  'wellness-assistant': [
    { emoji: '😌', prompt: "I'm feeling stressed..." },
    { emoji: '💤', prompt: 'How can I sleep better?' },
    { emoji: '🧘', prompt: 'Guide me through a meditation session' },
  ],
  'relationship-advisor': [
    { emoji: '💬', prompt: 'Help me communicate with my partner' },
    { emoji: '😰', prompt: 'I feel insecure in my relationship' },
    { emoji: '💕', prompt: 'How can I grow closer to my partner?' },
  ],
  companion: [
    { emoji: '👋', prompt: 'Hey, how was your day?' },
    { emoji: '🃏', prompt: 'Want to play a game?' },
    { emoji: '🎬', prompt: 'What movie would you recommend?' },
  ],
};

export const DEFAULT_MODEL_CONFIG = LLM.gpt;
export const DEFAULT_MODEL = DEFAULT_MODEL_CONFIG.model;

export const getModelConfig = (model: TLlmName) => {
  return (
    Object.values(LLM).find((m) => m.model === model) || DEFAULT_MODEL_CONFIG
  );
};
