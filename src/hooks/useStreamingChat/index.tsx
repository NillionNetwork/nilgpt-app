import { useState } from 'react';

import { DEFAULT_MODEL, LLM } from '@/constants/llm';
import API from '@/services/API';
import { ISendMessageParams, IUseStreamingChatParams } from './types';

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const sendMessage = async ({
    question,
    messages,
    persona,
    shouldUseWebSearch = false,
  }: ISendMessageParams) => {
    try {
      setIsSendingMessage(true);
      const response = await API.chat({
        messages,
        stream: true,
        persona,
        web_search: shouldUseWebSearch,
        model: persona === 'companion' ? LLM.gemma.model : DEFAULT_MODEL,
      });

      if (!response || !response.body) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedAnswer = '';

      setIsSendingMessage(false);
      setIsStreaming(true);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const newContent = processChunk(chunk);

          if (newContent) {
            accumulatedAnswer += newContent;
            onUpdate(accumulatedAnswer);
          }
        }
      } finally {
        reader.releaseLock();
      }

      setIsStreaming(false);
      if (!accumulatedAnswer) {
        throw new Error('No content');
      }

      onComplete(question, accumulatedAnswer);
    } catch (error) {
      console.error(error);
      setIsSendingMessage(false);
      setIsStreaming(false);
      onError();
    }
  };

  return {
    sendMessage,
    isSendingMessage,
    isStreaming,
  };
};

export default useStreamingChat;
