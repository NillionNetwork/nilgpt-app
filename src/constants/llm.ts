import type { TPersona } from '@/types/chat';

export const LLM = {
  gemma: {
    model: 'google/gemma-3-27b-it',
    infoLink: 'https://huggingface.co/google/gemma-3-27b-it',
  },
  gpt: {
    model: 'openai/gpt-oss-20b',
    infoLink: 'https://huggingface.co/openai/gpt-oss-20b',
  },
  llama: {
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    infoLink: 'https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct',
  },
} as const;

export const DEFAULT_MODEL = LLM.gpt.model;

export const PROMPT_SUGGESTIONS: Record<
  TPersona,
  { emoji: string; prompt: string }[]
> = {
  'personal-assistant': [
    { emoji: '🎁', prompt: 'Help me pick a gift for someone' },
    { emoji: '🧠', prompt: 'Quiz me before an interview or exam' },
    { emoji: '🎒', prompt: 'Help me pack for a trip' },
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

export const PDF_ATTACHMENT_PROMPT = `This text is extracted from a PDF. Always refer to this text as an attached PDF, do not refer to this as "provided text".`;

export const CHAT_TITLE_PROMPT =
  'Summarize this conversation in three words or less. Do not include periods.';
