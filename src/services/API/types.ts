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

export interface ICreateMessageRequest {
  chat_id: string;
  role: TRole;
  blindfoldContent: string;
  order: number;
  timestamp: string;
  model: TLlmName;
  attachments?: TMessageAttachment[];
  sources?: IWebSearchSource[];
}

export interface ICreateChatRequest {
  _id: string;
  title: string;
  message_count: number;
  persona: TPersona;
}

export interface IUpdateChatRequest {
  _id: string;
  message_count?: number;
  title?: string;
  noTitle?: boolean;
}

export interface IDefaultApiResponse {
  success: boolean;
}

export interface IDeleteChatRequest {
  chatId: string;
}
