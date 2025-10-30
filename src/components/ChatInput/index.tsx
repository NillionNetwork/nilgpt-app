import { useRef, useState } from 'react';

import { DEFAULT_MODEL } from '@config/llm';
import type { IChatInputProps } from './types';
import { Textarea } from '../ui/textarea';
import { TextInput, TextInputSubmitEditingEvent, View } from 'react-native';
import { Text } from '../ui/text';
import { USER_INPUT_WORD_LIMIT } from './constants';

const ChatInput: React.FC<IChatInputProps> = ({ onSendMessage, isLoading }) => {
  const textareaRef = useRef<TextInput>(null);
  const [input, setInput] = useState('');
  const [isOverLimit, setIsOverLimit] = useState(false);

  const handleSubmit = (e: TextInputSubmitEditingEvent) => {
    e.preventDefault();

    const isOverLimit = input.trim().split(' ').length > USER_INPUT_WORD_LIMIT;
    setIsOverLimit(isOverLimit);

    if (!input.trim() || isLoading || isOverLimit) {
      return;
    }

    onSendMessage({
      content: input,
      model: DEFAULT_MODEL,
    });
    setInput('');
    setIsOverLimit(false);
  };

  return (
    <View className="w-full">
      <View className="relative rounded-3xl border border-neutral-200 bg-transparent p-2 pb-1">
        <Textarea
          ref={textareaRef}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="What do you want to ask?"
          editable={!isLoading}
          onSubmitEditing={handleSubmit}
          autoFocus
          autoCorrect
          autoCapitalize="sentences"
          className="max-h-36 border-0"
        />
      </View>
      {isOverLimit && (
        <Text className="mt-2 text-center text-xs text-red-500">
          Reached {USER_INPUT_WORD_LIMIT} word limit. Please shorten your
          message to send.
        </Text>
      )}
    </View>
  );
};

export default ChatInput;
