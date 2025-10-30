import type { TLLMName } from '@/config/llm';

export interface ISendMessageParams {
  content: string;
  model?: TLLMName;
}

export interface IChatInputProps {
  onSendMessage: (message: ISendMessageParams) => void;
  isLoading: boolean;
}
