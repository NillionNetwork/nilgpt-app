import type { IMessage } from '@/types/chat';

export interface IChatBubbleProps extends IMessage {
  isStreaming: boolean;
  isSendingMessage: boolean;
  isSearchingWeb: boolean;
}
