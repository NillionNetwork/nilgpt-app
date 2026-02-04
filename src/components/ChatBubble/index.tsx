import { Link } from 'expo-router';
import { View } from 'react-native';
import colors from 'tailwindcss/colors';

import CopyToClipboardButton from '@/components/CopyToClipboardButton';
import type { TMessageAttachment } from '@/types/chat';
import { cn } from '@/utils/cn';
import Markdown from '@ronradtke/react-native-markdown-display';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/hover-card';
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
  sources,
}) => {
  const isUserMessage = role === 'user';

  if (isSearchingWeb) {
    return (
      <Text className="animate-pulse py-2 pl-1 text-neutral-400">
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
          className="h-4 w-4 animate-spin text-neutral-500"
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
        return (
          <Feather name="image" size={15} className="text-muted-foreground" />
        );
      case 'pdf':
        return (
          <FontAwesome6
            name="file-pdf"
            size={14}
            className="text-muted-foreground"
          />
        );
      default:
        return (
          <Feather
            name="paperclip"
            size={15}
            className="text-muted-foreground"
          />
        );
    }
  };

  return (
    <View>
      {attachments && attachments.length > 0 && (
        <View className="mb-1 ml-auto w-fit flex-row items-center justify-center gap-1">
          <Text className="text-sm text-muted-foreground">Attached</Text>
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
          mergeStyle
          style={{
            ...markdownStyles,
            text: {
              ...markdownStyles.text,
              color: isUserMessage ? colors.black : colors.neutral[300],
            },
          }}>
          {content as string}
        </Markdown>
        {!isUserMessage && isStreaming && (
          <View className="inline-block h-4 w-2 animate-pulse bg-neutral-400 align-text-bottom" />
        )}
        {!isUserMessage && !isStreaming && (
          <View className="flex flex-row items-center gap-3">
            <CopyToClipboardButton content={content as string} />
            {sources && sources.length > 0 && (
              <HoverCard openDelay={300}>
                <HoverCardTrigger
                  tabIndex={0}
                  className="flex flex-row items-center gap-1 active:opacity-70">
                  <Feather
                    name="globe"
                    size={14}
                    className="text-neutral-400"
                  />
                  <Text className="text-sm text-neutral-400">Sources</Text>
                </HoverCardTrigger>
                <HoverCardContent align="start" side="top">
                  <View className="flex flex-col gap-3">
                    <Text className="text-neutral-400">
                      Sources used to generate this response:
                    </Text>

                    <View className="flex flex-col gap-1">
                      {sources.map(({ source }) => {
                        if (!source.startsWith('http')) {
                          return null;
                        }

                        const sourceUrl = new URL(source);
                        const sourceDomain = sourceUrl.hostname;
                        return (
                          <Link
                            href={source}
                            key={source}
                            className="text-neutral-400 underline">
                            {sourceDomain}
                          </Link>
                        );
                      })}
                    </View>
                  </View>
                </HoverCardContent>
              </HoverCard>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatBubble;
