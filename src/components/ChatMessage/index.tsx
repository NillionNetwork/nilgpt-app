import { View } from 'react-native';

import { cn } from '@/utils/cn';
import { Text } from '@ui/text';
import { Feather } from '../ExpoIcon';
import type { IChatMessageProps } from './types';

const ChatMessage: React.FC<IChatMessageProps> = ({
  role,
  content,
  isStreaming,
  isSendingMessage,
  isSearchingWeb,
}) => {
  const isUserMessage = role === 'user';

  if (isSearchingWeb) {
    return (
      <Text className="animate-pulse py-2 pl-1 text-gray-400">
        Searching the web...
      </Text>
    );
  }

  if (isSendingMessage) {
    return (
      <View className="py-2 pl-1">
        <Feather
          size={14}
          name="refresh-cw"
          className="h-4 w-4 animate-spin text-gray-500"
        />
      </View>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <View
      className={cn(
        'max-w-[80%] break-words rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr px-4 py-2',
        isUserMessage
          ? 'self-end bg-white'
          : 'self-start bg-transparent px-0 pl-1',
      )}>
      <Text className={cn(isUserMessage ? 'text-black' : 'text-gray-700')}>
        {content as string}
      </Text>
      {!isUserMessage && isStreaming && (
        <View className="inline-block h-4 w-2 animate-pulse bg-gray-400 align-text-bottom" />
      )}
    </View>
  );
};

export default ChatMessage;
