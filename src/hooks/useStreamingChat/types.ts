import type {
  IMessage,
  TLlmName,
  TMessageAttachment,
  TPersona,
} from '@/types/chat';

export interface IOnStreamCompleteParams {
  question: string;
  answer: string;
  modelUsed: TLlmName;
  attachments: TMessageAttachment[];
}
export interface IUseStreamingChatParams {
  onUpdate: (answer: string) => void;
  onComplete: (params: IOnStreamCompleteParams) => void;
  onError: () => void;
}

export interface ISendMessageParams {
  persona: TPersona;
  question: string;
  messages: IMessage[];
  shouldUseWebSearch?: boolean;
  attachments: TMessageAttachment[];
}
