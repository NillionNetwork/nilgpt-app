import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import ChatInput from '@components/ChatInput';
import { useLocalSearchParams } from 'expo-router';
import API from '@/services/API';
import useStreamingChat from '@/hooks/useStreamingChat';
import { IMessage } from '@/types/chat';
import { useEffect, useMemo, useState } from 'react';
import { ISendMessageParams } from '@/components/ChatInput/types';
import { DEFAULT_MODEL } from '@/constants/llm';
import ChatHeader from './ChatHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import PromptSuggestions from './PromptSuggestions';
import ChatMessage from '@/components/ChatMessage';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
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
  const { refetch: refetchChats } = API.useChats();

  useEffect(() => {
    if (isNewChat) {
      setMessages([]);
    }
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
          persona="personal-assistant"
        />
      ) : (
        <FlatList
          inverted
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
      <KeyboardAvoidingView
        keyboardVerticalOffset={12}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ChatInput
          chatId={chatId}
          onSendMessage={handleSendMessage}
          isLoading={
            isFetchingUploadedMessages || isSendingMessage || isStreaming
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
