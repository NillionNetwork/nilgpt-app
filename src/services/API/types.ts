import type { IChatItem, IMessage, TPersona, TLlmName } from '@/types/chat';

export interface IMessagesResponse {
  content: IMessage[];
}

export interface IChatRequest {
  messages: IMessage[];
  stream: boolean;
  persona: TPersona;
  web_search: boolean;
  model: TLlmName;
}

export interface IChatsResponse {
  content: {
    result: IChatItem[];
  };
}
