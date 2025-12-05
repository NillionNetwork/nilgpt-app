import { LLM } from '@/constants/llm';

export type TMessageAttachment = 'image' | 'pdf' | 'csv' | 'audio';

export interface ITextContent {
  type: 'text';
  text: string;
}

export interface IImageContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

export interface IWebSearchSource {
  source: string;
}

export type TMessageContent = ITextContent | IImageContent;

export interface IMessage {
  role: 'user' | 'assistant';
  content: string | TMessageContent[];
  attachments?: TMessageAttachment[] | null;
  sources?: IWebSearchSource[] | null;
}

export type TPersona =
  | 'personal-assistant'
  | 'wellness-assistant'
  | 'relationship-advisor'
  | 'companion';

export interface IChatItem {
  _id: string;
  title: string;
  persona?: TPersona;
}

export type TLlmName = (typeof LLM)[keyof typeof LLM]['model'];
