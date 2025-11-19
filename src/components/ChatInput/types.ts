import type { TLLMName } from '@constants/llm';

export interface ISendMessageParams {
  question: string;
  model?: TLLMName;
}

export interface IChatInputProps {
  chatId: string;
  isLoading: boolean;
  onSendMessage: (message: ISendMessageParams) => void;
}
