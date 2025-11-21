import { IMessage, TPersona, TLlmName } from '@/types/chat';

export interface IUseStreamingChatParams {
  model?: TLlmName;
  persona?: TPersona;
  shouldUseWebSearch?: boolean;
  onUpdate: (answer: string) => void;
  onComplete: (question: string, answer: string) => void;
  onError: () => void;
}

export interface ISendMessageParams {
  question: string;
  messages: IMessage[];
}
