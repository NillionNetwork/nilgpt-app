import { useAuthContext } from '@/hooks/useAuthContext';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Keyboard,
} from 'react-native';
import { Text } from '@ui/text';
import ChatInput from '@components/ChatInput';
import { supabase } from '@services/Supabase';
import { useLocalSearchParams } from 'expo-router';
import API from '@/services/API';
import useStreamingChat from '@/hooks/useStreamingChat';
import { IMessage } from '@/types/chat';
import { useMemo, useState } from 'react';
import { ISendMessageParams } from '@/components/ChatInput/types';
import { DEFAULT_MODEL } from '@/constants/llm';
import { cn } from '@/utils/cn';

const ChatScreen: React.FC = () => {
  const { session } = useAuthContext();
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { data: uploadedMessages, isPending: isFetchingUploadedMessages } =
    API.useChatMessages(chatId);

  const [messages, setMessages] = useState<IMessage[]>(
    uploadedMessages?.content || [],
  );

  const { mutateAsync: createMessageMutation } = API.useCreateMessage();
  const { mutateAsync: createChatMutation } = API.useCreateChat();
  const { mutateAsync: updateChatMutation } = API.useUpdateChat();

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

  const { sendMessage, isSendingMessage } = useStreamingChat({
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

  const handleSendMessage = async ({ question }: ISendMessageParams) => {
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

    await sendMessage({ question, messages: messagesToSend });
  };

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  return (
    <View className="flex flex-1 p-3 pb-0">
      <Text variant="muted" className="text-center text-gray-500">
        Chat ID: {chatId}
      </Text>
      <Text className="text-center text-gray-500">
        Logged in as: {session?.user?.email}
      </Text>
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text className="text-center text-gray-500">Logout</Text>
      </Pressable>
      <FlatList
        className="w-full flex-1"
        showsVerticalScrollIndicator={false}
        data={reversedMessages}
        inverted
        renderItem={({ item }) => {
          if (!item.content) {
            return null;
          }

          const isUserMessage = item.role === 'user';
          return (
            <View
              className={cn(
                'mb-2 max-w-[80%] break-words rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr px-6 py-3',
                isUserMessage
                  ? 'self-end bg-white'
                  : 'self-start bg-transparent',
              )}>
              <Text
                className={cn(isUserMessage ? 'text-black' : 'text-gray-700')}>
                {item.content as string}
              </Text>
            </View>
          );
        }}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={60}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isFetchingUploadedMessages || isSendingMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
