import { View } from 'react-native';
import colors from 'tailwindcss/colors';

import type { TMessageAttachment } from '@/types/chat';
import { cn } from '@/utils/cn';
import Markdown from '@ronradtke/react-native-markdown-display';
import { Text } from '@ui/text';
import { Feather, FontAwesome6 } from '../ExpoIcon';
import { markdownStyles } from './styles';
import type { IChatBubbleProps } from './types';

const ChatBubble: React.FC<IChatBubbleProps> = ({
  role,
  content,
  isStreaming,
  isSendingMessage,
  isSearchingWeb,
  attachments,
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

  const getMessageAttachmentIcon = (attachment: TMessageAttachment) => {
    switch (attachment) {
      case 'image':
        return <Feather name="image" size={15} className="text-gray-500" />;
      case 'pdf':
        return (
          <FontAwesome6 name="file-pdf" size={14} className="text-gray-500" />
        );
      default:
        return <Feather name="paperclip" size={15} className="text-gray-500" />;
    }
  };

  return (
    <View>
      {attachments && attachments.length > 0 && (
        <View className="mb-1 ml-auto w-fit flex-row items-center justify-center gap-1">
          <Text className="text-sm text-gray-500">Attached</Text>
          <View className="flex flex-row items-center justify-center gap-1">
            {attachments.map((attachment) => (
              <View key={attachment}>
                {getMessageAttachmentIcon(attachment)}
              </View>
            ))}
          </View>
        </View>
      )}
      <View
        className={cn(
          'break-words rounded-bl-2xl rounded-br-2xl rounded-tl-2xl rounded-tr px-4',
          isUserMessage
            ? 'max-w-[90%] self-end bg-white'
            : 'max-w-[100%] self-start bg-transparent px-1',
        )}>
        <Markdown
          style={{
            ...markdownStyles,
            text: {
              ...markdownStyles.text,
              color: isUserMessage ? colors.black : colors.gray[700],
            },
          }}>
          {content as string}
        </Markdown>
        {!isUserMessage && isStreaming && (
          <View className="inline-block h-4 w-2 animate-pulse bg-gray-400 align-text-bottom" />
        )}
      </View>
    </View>
  );
};

export default ChatBubble;
