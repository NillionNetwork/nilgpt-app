import { IMessage, TPersona } from '@/types/chat';

export interface IUseStreamingChatParams {
  onUpdate: (answer: string) => void;
  onComplete: (question: string, answer: string) => void;
  onError: () => void;
}

export interface ISendMessageParams {
  persona: TPersona;
  question: string;
  messages: IMessage[];
  shouldUseWebSearch?: boolean;
}
