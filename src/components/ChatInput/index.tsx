import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AntDesign, Feather } from '@components/ExpoIcon';
import { DEFAULT_MODEL } from '@constants/llm';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { Switch } from '@ui/switch';
import { Text } from '@ui/text';
import { Textarea } from '@ui/textarea';
import { USER_INPUT_WORD_LIMIT } from './constants';
import type { IChatInputProps } from './types';

const ChatInput: React.FC<IChatInputProps> = ({
  chatId,
  isLoading,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);

  useEffect(() => {
    if (chatId) {
      setInput('');
      setIsOverLimit(false);
    }
  }, [chatId]);

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    const isOverLimit = trimmedInput.split(' ').length > USER_INPUT_WORD_LIMIT;
    setIsOverLimit(isOverLimit);
    if (isOverLimit) {
      return;
    }

    onSendMessage({
      question: trimmedInput,
      model: DEFAULT_MODEL,
      shouldUseWebSearch: isWebSearchEnabled,
    });
    setInput('');
    setIsOverLimit(false);
    setIsWebSearchEnabled(false);
  };

  return (
    <View className="w-full">
      <View className="relative rounded-3xl border border-neutral-200 bg-white p-2">
        <Textarea
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="What do you want to ask?"
          autoCorrect
          autoCapitalize="sentences"
          className="max-h-36 border-0"
          placeholderClassName="text-gray-400"
        />
        <View className="flex w-full flex-row items-center justify-between">
          <View className="ml-auto flex flex-row items-center justify-center gap-3">
            <View className="flex flex-row items-center justify-center gap-1">
              <Label
                htmlFor="web-search"
                nativeID="web-search"
                onPress={() => setIsWebSearchEnabled((prev) => !prev)}>
                <Feather name="globe" size={18} color="bg-primary" />
              </Label>
              <Switch
                id="web-search"
                nativeID="web-search"
                checked={isWebSearchEnabled}
                onCheckedChange={setIsWebSearchEnabled}
                disabled={isLoading}
              />
            </View>
            <Button
              className=" h-10 w-10 items-center justify-center rounded-full"
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
