import type {
  IChatItem,
  IMessage,
  TPersona,
  TLlmName,
  TMessageAttachment,
  TRole,
  IWebSearchSource,
} from '@/types/chat';

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

export interface IMessageMutation {
  chat_id: string;
  role: TRole;
  blindfoldContent: string;
  order: number;
  timestamp: string;
  model: TLlmName;
  attachments?: TMessageAttachment[];
  sources?: IWebSearchSource[];
}

export interface ICreateChatMutation {
  _id: string;
  title: string;
  message_count: number;
  persona: TPersona;
}

export interface IDeleteAccountResponse {
  success: boolean;
}
