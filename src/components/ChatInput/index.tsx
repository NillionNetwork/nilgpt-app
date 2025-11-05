import { useState } from 'react';
import { View } from 'react-native';

import { AntDesign } from '@components/ExpoIcon';
import { DEFAULT_MODEL } from '@constants/llm';
import { Button } from '@ui/button';
import { Text } from '@ui/text';
import { Textarea } from '@ui/textarea';
import { USER_INPUT_WORD_LIMIT } from './constants';
import type { IChatInputProps } from './types';

const ChatInput: React.FC<IChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isOverLimit, setIsOverLimit] = useState(false);

  const handleSubmit = () => {
    const isOverLimit = input.trim().split(' ').length > USER_INPUT_WORD_LIMIT;
    setIsOverLimit(isOverLimit);
    if (isOverLimit) {
      return;
    }

    onSendMessage({
      question: input,
      model: DEFAULT_MODEL,
    });
    setInput('');
    setIsOverLimit(false);
  };

  return (
    <View className="w-full">
      <View className="relative rounded-3xl border border-neutral-200 bg-white p-2">
        <Textarea
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="What do you want to ask?"
          autoFocus
          autoCorrect
          autoCapitalize="sentences"
          className="max-h-36 border-0"
        />
        <View className="flex w-full flex-row items-center">
          <Button
            className="ml-auto h-10 w-10 items-center justify-center rounded-full"
            disabled={isLoading || isOverLimit || !input.trim()}
            onPress={handleSubmit}>
            <AntDesign
              name="arrow-up"
              size={16}
              className="absolute self-center color-yellow"
            />
          </Button>
        </View>
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
