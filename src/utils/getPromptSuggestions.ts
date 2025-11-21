import { TPersona } from '@/types/chat';
import { PROMPT_SUGGESTIONS } from '@/constants/llm';

const getPromptSuggestions = (persona: TPersona) => {
  return PROMPT_SUGGESTIONS[persona] || PROMPT_SUGGESTIONS.companion;
};

export default getPromptSuggestions;
