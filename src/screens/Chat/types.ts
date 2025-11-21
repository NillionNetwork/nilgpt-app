import { ISendMessageParams } from '@/components/ChatInput/types';
import { TPersona } from '@/types/chat';

export interface IPromptSuggestionsProps {
  persona: TPersona;
  handleSendMessage: (params: ISendMessageParams) => void;
}
