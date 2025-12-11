import { CHAT_TITLE_PROMPT, DEFAULT_MODEL } from '@/constants/llm';
import { DEFAULT_CHAT_TITLE, DEFAULT_PERSONA } from '@/screens/Chat/constants';
import API from '@/services/API';
import type { IMessage } from '@/types/chat';

const useChatSummary = () => {
  const getSummarisedChatTitle = async (question: string, answer: string) => {
    const messages: IMessage[] = [
      { role: 'user', content: question },
      { role: 'assistant', content: answer },
      { role: 'user', content: CHAT_TITLE_PROMPT },
    ];

    let chatTitle = DEFAULT_CHAT_TITLE;
    try {
      const response = await API.chat({
        stream: false,
        persona: DEFAULT_PERSONA,
        web_search: false,
        model: DEFAULT_MODEL,
        messages,
      }).then((res) => res.json());

      chatTitle =
        response?.choices?.[0]?.message?.content || DEFAULT_CHAT_TITLE;
    } catch (error) {
      console.error(error);
    }

    return chatTitle;
  };

  return { getSummarisedChatTitle };
};

export default useChatSummary;
