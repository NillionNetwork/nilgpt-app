import type { IMessage } from '@/types/chat';

export interface IChatMessageProps extends IMessage {
  isStreaming: boolean;
  isSendingMessage: boolean;
  isSearchingWeb: boolean;
}
