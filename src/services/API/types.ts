import { TLLMName } from '@/constants/llm';
import type { IMessage } from '@/types/chat';

export interface IMessagesResponse {
  content: IMessage[];
}

export interface IChatRequest {
  messages: IMessage[];
  stream: boolean;
  persona: string;
  web_search: boolean;
  model: TLLMName;
}
