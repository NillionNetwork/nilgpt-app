import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ISendMessageParams } from '@/components/ChatInput/types';
import ChatMessage from '@/components/ChatMessage';
import { DEFAULT_MODEL } from '@/constants/llm';
import useStreamingChat from '@/hooks/useStreamingChat';
import API from '@/services/API';
import type { IMessage, TPersona } from '@/types/chat';
import ChatInput from '@components/ChatInput';
import ChatHeader from './ChatHeader';
import PromptSuggestions from './PromptSuggestions';
import { DEFAULT_PERSONA } from './constants';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [persona, setPersona] = useState<TPersona>(DEFAULT_PERSONA);

  const { id: chatId, newChat } = useLocalSearchParams<{
    id: string;
    newChat: string;
  }>();
  const isNewChat = newChat === 'true';

  const { data: uploadedMessages, isFetching: isFetchingUploadedMessages } =
    API.useChatMessages(isNewChat ? null : chatId);
  const { mutateAsync: createMessageMutation } = API.useCreateMessage();
  const { mutateAsync: createChatMutation } = API.useCreateChat();
  const { mutateAsync: updateChatMutation } = API.useUpdateChat();
  const { data: chats, refetch: refetchChats } = API.useChats();

  useEffect(() => {
    if (isNewChat) {
      setMessages([]);
      setPersona(DEFAULT_PERSONA);
    } else {
      const preSelectedPersona = chats?.find((c) => c._id === chatId)?.persona;
      setPersona(preSelectedPersona || DEFAULT_PERSONA);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewChat, chatId]);

  useEffect(() => {
    if (uploadedMessages) {
      setMessages(uploadedMessages);
    }
  }, [uploadedMessages]);

  const onStreamComplete = async (question: string, answer: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: 'assistant',
        content: answer,
      };
      return updated;
    });

    const totalMessageCount = messages.length + 2;

    if (totalMessageCount === 2) {
      await createChatMutation({
        _id: chatId,
        title: 'New Chat',
        message_count: totalMessageCount,
        persona,
      });

      await Promise.all([
        createMessageMutation({
          chat_id: chatId,
          role: 'user',
          blindfoldContent: question,
          order: 1,
          timestamp: new Date().toISOString(),
          model: DEFAULT_MODEL,
        }),
        createMessageMutation({
          chat_id: chatId,
          role: 'assistant',
          blindfoldContent: answer,
          order: 2,
          timestamp: new Date().toISOString(),
          model: DEFAULT_MODEL,
        }),
      ]);

      await refetchChats();
    }

    if (totalMessageCount > 2) {
      await Promise.all([
        createMessageMutation({
          chat_id: chatId,
          role: 'user',
          blindfoldContent: question,
          order: totalMessageCount - 1,
          timestamp: new Date().toISOString(),
          model: DEFAULT_MODEL,
        }),
        createMessageMutation({
          chat_id: chatId,
          role: 'assistant',
          blindfoldContent: answer,
          order: totalMessageCount,
          timestamp: new Date().toISOString(),
          model: DEFAULT_MODEL,
        }),
      ]);

      await updateChatMutation({
        _id: chatId,
        message_count: totalMessageCount,
        noTitle: true,
      });
    }
  };

  const { sendMessage, isSendingMessage, isStreaming } = useStreamingChat({
    onComplete: onStreamComplete,
    onUpdate: (answer) =>
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: answer,
        };
        return updated;
      }),
    onError: () =>
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        };
        return updated;
      }),
  });

  const handleSendMessage = async ({
    question,
    persona,
    shouldUseWebSearch,
  }: ISendMessageParams) => {
    const messagesToSend = [
      ...messages,
      {
        role: 'user',
        content: question,
      },
      {
        role: 'assistant',
        content: '',
      },
    ] as IMessage[];
    setMessages(messagesToSend);
    Keyboard.dismiss();

    await sendMessage({
      question,
      persona,
      messages: messagesToSend,
      shouldUseWebSearch,
    });
  };

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <SafeAreaView className="flex flex-1 px-3">
      <ChatHeader />
      {isNewChat && messages.length === 0 ? (
        <PromptSuggestions
          handleSendMessage={handleSendMessage}
          persona={persona}
        />
      ) : (
        <FlatList
          inverted
          keyboardDismissMode="interactive"
          className="w-full flex-1"
          contentContainerClassName="pb-16"
          data={reversedMessages}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLatestMessage = index === 0;
            return (
              <ChatMessage
                {...item}
                isStreaming={isStreaming && isLatestMessage}
              />
            );
          }}
        />
      )}
      <KeyboardAvoidingView keyboardVerticalOffset={12} behavior="padding">
        <ChatInput
          chatId={chatId}
          persona={persona}
          onPersonaChange={setPersona}
          onSendMessage={handleSendMessage}
          shouldDisablePersonaSelector={messages.length > 0}
          isLoading={
            isFetchingUploadedMessages || isSendingMessage || isStreaming
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
