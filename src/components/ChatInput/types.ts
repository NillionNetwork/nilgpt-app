import type { TLlmName } from '@/types/chat';

export interface ISendMessageParams {
  question: string;
  model?: TLlmName;
  shouldUseWebSearch?: boolean;
}

export interface IChatInputProps {
  chatId: string;
  isLoading: boolean;
  onSendMessage: (message: ISendMessageParams) => void;
}
