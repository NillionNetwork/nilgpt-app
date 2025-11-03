import type { TLLMName } from '@constants/llm';

export interface ISendMessageParams {
  content: string;
  model?: TLLMName;
}

export interface IChatInputProps {
  onSendMessage: (message: ISendMessageParams) => void;
  isLoading: boolean;
}
