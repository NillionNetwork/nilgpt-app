import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AntDesign, Feather } from '@components/ExpoIcon';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { Switch } from '@ui/switch';
import { Text } from '@ui/text';
import { Textarea } from '@ui/textarea';
import { ExpoImage } from '../Image';
import { USER_INPUT_WORD_LIMIT } from './constants';
import PersonaSelector from './PersonaSelector';
import type { IChatInputProps, IPickedImage } from './types';

const ChatInput: React.FC<IChatInputProps> = ({
  chatId,
  isLoading,
  persona,
  shouldDisablePersonaSelector,
  onPersonaChange,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
  const [pickedImage, setPickedImage] = useState<IPickedImage | null>(null);

  useEffect(() => {
    if (chatId) {
      setInput('');
      setIsOverLimit(false);
      setIsWebSearchEnabled(false);
      setPickedImage(null);
    }
  }, [chatId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.4,
      base64: true,
      exif: false,
    });

    if (!result.canceled) {
      setPickedImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  const handleSubmit = () => {
    const trimmedInput = input.trim();
    const isOverLimit = trimmedInput.split(' ').length > USER_INPUT_WORD_LIMIT;

    setIsOverLimit(isOverLimit);
    if (isOverLimit) {
      return;
    }

    onSendMessage({
      question: trimmedInput,
      persona,
      shouldUseWebSearch: isWebSearchEnabled,
      attachmentData: {
        imageDataUrl: pickedImage?.base64
          ? `data:image/jpeg;base64,${pickedImage.base64}`
          : null,
      },
    });
    setInput('');
    setIsOverLimit(false);
    setIsWebSearchEnabled(false);
    setPickedImage(null);
  };

  return (
    <View className="w-full">
      <View className="relative rounded-3xl border border-neutral-200 bg-white p-2">
        <View className="flex items-start justify-center gap-3">
          {pickedImage && (
            <View className="relative">
              <AntDesign
                name="close"
                size={10}
                className="absolute -right-1.5 -top-1.5 z-10 items-center rounded-full bg-neutral-200 p-1 text-primary active:opacity-70"
                onPress={() => setPickedImage(null)}
                suppressHighlighting
              />
              <ExpoImage
                source={{ uri: pickedImage.uri }}
                className="h-24 w-24 rounded-lg"
                contentFit="cover"
              />
            </View>
          )}
        </View>
        <Textarea
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="What do you want to ask?"
          autoCorrect
          autoCapitalize="sentences"
          className="max-h-36 border-0 px-1"
          placeholderClassName="text-gray-400"
        />
        <View className="flex w-full flex-row items-center justify-between">
          <View className="flex items-center justify-center gap-4">
            <Feather
              name="image"
              size={18}
              className="text-primary active:opacity-70 disabled:opacity-50"
              onPress={pickImage}
              disabled={isLoading}
              suppressHighlighting
            />
          </View>
          <View className="ml-auto flex flex-row items-center justify-center gap-4">
            <PersonaSelector
              persona={persona}
              disabled={isLoading || shouldDisablePersonaSelector}
              onPersonaChange={onPersonaChange}
            />
            <View className="flex flex-row items-center justify-center gap-0.5">
              <Label
                htmlFor="web-search"
                nativeID="web-search"
                disabled={isLoading}
                onPress={() => setIsWebSearchEnabled((prev) => !prev)}>
                <Feather name="globe" size={18} className="text-primary" />
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
