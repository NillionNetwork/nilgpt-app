import { useState } from 'react';

import { DEFAULT_MODEL, LLM } from '@/constants/llm';
import API from '@/services/API';
import type { ISendMessageParams, IUseStreamingChatParams } from './types';

const parseSSELine = (line: string): string | null => {
  const trimmed = line.trim();
  if (!trimmed || trimmed === 'data: [DONE]') return null;
  if (!trimmed.startsWith('data: ')) return null;

  try {
    const jsonStr = trimmed.slice(6);
    const parsed = JSON.parse(jsonStr);
    return parsed.choices?.[0]?.delta?.content || null;
  } catch (error) {
    console.warn('Failed to parse streaming chunk:', error);
    return null;
  }
};

const processChunk = (chunk: string): string => {
  const lines = chunk.split('\n');
  let newContent = '';

  for (const line of lines) {
    const content = parseSSELine(line);
    if (content) {
      newContent += content;
    }
  }

  return newContent;
};

const useStreamingChat = ({
  onUpdate,
  onComplete,
  onError,
}: IUseStreamingChatParams) => {
  const [chatState, setChatState] = useState({
    isStreaming: false,
    isSendingMessage: false,
    isSearchingWeb: false,
  });

  const sendMessage = async ({
    question,
    messages,
    persona,
    shouldUseWebSearch = false,
  }: ISendMessageParams) => {
    const model = persona === 'companion' ? LLM.gemma.model : DEFAULT_MODEL;

    try {
      setChatState({
        isSendingMessage: true,
        isSearchingWeb: shouldUseWebSearch,
        isStreaming: false,
      });

      const response = await API.chat({
        messages,
        stream: true,
        persona,
        web_search: shouldUseWebSearch,
        model,
      });

      if (!response || !response.body) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = '';
      let hasReceivedFirstChunk = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const newContent = processChunk(chunk);

          if (newContent) {
            if (!hasReceivedFirstChunk) {
              hasReceivedFirstChunk = true;
              setChatState({
                isSendingMessage: false,
                isSearchingWeb: false,
                isStreaming: true,
              });
            }
            accumulatedAnswer += newContent;
            onUpdate(accumulatedAnswer);
          }
        }
      } finally {
        reader.releaseLock();
      }

      setChatState({
        isSendingMessage: false,
        isSearchingWeb: false,
        isStreaming: false,
      });

      if (!accumulatedAnswer) {
        throw new Error('No content');
      }

      onComplete({ question, answer: accumulatedAnswer, modelUsed: model });
    } catch (error) {
      console.error(error);
      setChatState({
        isSendingMessage: false,
        isSearchingWeb: false,
        isStreaming: false,
      });
      onError();
    }
  };

  return {
    sendMessage,
    isSendingMessage: chatState.isSendingMessage,
    isStreaming: chatState.isStreaming,
    isSearchingWeb: chatState.isSearchingWeb,
  };
};

export default useStreamingChat;
