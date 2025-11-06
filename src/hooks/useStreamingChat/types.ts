import { TLLMName } from '@/constants/llm';
import { IMessage } from '@/types/chat';

export interface IUseStreamingChatParams {
  model?: TLLMName;
  persona?: string;
  shouldUseWebSearch?: boolean;
  onUpdate: (answer: string) => void;
  onComplete: (question: string, answer: string) => void;
  onError: () => void;
}

export interface ISendMessageParams {
  question: string;
  messages: IMessage[];
}
