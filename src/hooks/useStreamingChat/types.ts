import { IMessage, TPersona, TLlmName } from '@/types/chat';

export interface IUseStreamingChatParams {
  model?: TLlmName;
  persona?: TPersona;
  onUpdate: (answer: string) => void;
  onComplete: (question: string, answer: string) => void;
  onError: () => void;
}

export interface ISendMessageParams {
  question: string;
  messages: IMessage[];
  shouldUseWebSearch?: boolean;
}
