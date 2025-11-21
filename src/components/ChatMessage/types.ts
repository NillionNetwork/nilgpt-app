import { IMessage } from '@/types/chat';

export interface IChatMessageProps extends IMessage {
  isStreaming: boolean;
}
