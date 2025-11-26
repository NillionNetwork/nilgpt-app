import type { TPersona } from '@/types/chat';

export interface ISendMessageParams {
  persona: TPersona;
  question: string;
  shouldUseWebSearch?: boolean;
}

export interface IChatInputProps {
  chatId: string;
  persona: TPersona;
  isLoading: boolean;
  shouldDisablePersonaSelector: boolean;
  onSendMessage: (message: ISendMessageParams) => void;
  onPersonaChange: (persona: TPersona) => void;
}

export interface IPersonaSelectorProps {
  persona: TPersona;
  disabled: boolean;
  onPersonaChange: (persona: TPersona) => void;
}

export interface IPersonaOption {
  value: TPersona;
  label: string;
  description: string;
}
