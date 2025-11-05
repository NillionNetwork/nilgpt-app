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

export type IChatMessageContent = ITextContent | IImageContent;

export interface IMessage {
  role: 'user' | 'assistant';
  content: string | IChatMessageContent[];
  attachments?: TMessageAttachment[] | null;
  sources?: IWebSearchSource[] | null;
}

export interface IChatItem {
  _id: string;
  title: string;
  persona?: string;
}
