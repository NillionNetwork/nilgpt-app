import * as DocumentPicker from 'expo-document-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import getPDFText from '@/utils/getPDFText';
import { AntDesign, Feather, FontAwesome6 } from '@components/ExpoIcon';
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
  const [hasPickedPDF, setHasPickedPDF] = useState(false);
  const [PDFText, setPDFText] = useState<string | null>(null);

  useEffect(() => {
    if (chatId) {
      setInput('');
      setIsOverLimit(false);
      setIsWebSearchEnabled(false);
      setPickedImage(null);
      setHasPickedPDF(false);
      setPDFText(null);
    }
  }, [chatId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.4,
      base64: true,
      exif: false,
    });

    if (!result.canceled) {
      let imageBase64 = result.assets[0].base64;
      if (result.assets[0].mimeType === 'image/heic') {
        const convertedImage = await ImageManipulator.manipulate(
          result.assets[0].uri,
        )
          .renderAsync()
          .then((image) =>
            image.saveAsync({
              format: SaveFormat.JPEG,
              compress: 0.4,
              base64: true,
            }),
          );
        imageBase64 = convertedImage.base64;
      }

      setPickedImage({
        uri: result.assets[0].uri,
        base64: imageBase64,
      });
    }
  };

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const PDFText = await getPDFText(result.assets[0].uri);
      if (PDFText) {
        setPDFText(PDFText);
        setHasPickedPDF(true);
      }
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
        pdfData: {
          useAsAttachment: hasPickedPDF,
          textContent: PDFText,
        },
      },
    });
    setInput('');
    setIsOverLimit(false);
    setIsWebSearchEnabled(false);
    setPickedImage(null);
    setHasPickedPDF(false);
  };

  return (
    <View className="w-full">
      <View className="relative rounded-3xl border border-input bg-input p-2">
        <View className="flex items-start justify-center gap-3">
          {pickedImage && (
            <View className="relative">
              <AntDesign
                name="close"
                size={10}
                className="absolute -right-1.5 -top-1.5 z-10 items-center rounded-full bg-secondary p-1 text-primary active:opacity-70"
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
          {hasPickedPDF && (
            <View className="relative">
              <AntDesign
                name="close"
                size={10}
                className="absolute -right-0.5 -top-1 z-10 items-center rounded-full bg-secondary p-1 text-primary active:opacity-70"
                onPress={() => setHasPickedPDF(false)}
                suppressHighlighting
              />
              <FontAwesome6
                name="file-pdf"
                size={36}
                className="p-1 text-primary"
              />
            </View>
          )}
        </View>
        <Textarea
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Ask anything privately"
          autoCorrect
          autoCapitalize="sentences"
          className="max-h-36 border-0 px-1"
          placeholderClassName="text-gray-400"
        />
        <View className="flex w-full flex-row items-center justify-between">
          <View className="flex flex-row items-center justify-center gap-3.5">
            <Feather
              name="image"
              size={18}
              className="text-primary active:opacity-70 disabled:opacity-50"
              onPress={pickImage}
              disabled={isLoading || hasPickedPDF}
              suppressHighlighting
            />
            <FontAwesome6
              name="file-pdf"
              size={15}
              className="text-primary active:opacity-70 disabled:opacity-50"
              onPress={pickPDF}
              disabled={isLoading || !!pickedImage}
              suppressHighlighting
            />
          </View>
          <View className="ml-auto flex flex-row items-center justify-center gap-4">
            <PersonaSelector
              persona={persona}
              disabled={isLoading || shouldDisablePersonaSelector}
              onPersonaChange={onPersonaChange}
            />
            <View className="flex flex-row items-center justify-center gap-1">
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
                className="color-bg-input absolute self-center"
              />
            </Button>
          </View>
        </View>
      </View>
      {isOverLimit && (
        <Text className="mt-2 text-center text-xs text-red-400">
          Reached {USER_INPUT_WORD_LIMIT} word limit. Please shorten your
          message to send.
        </Text>
      )}
    </View>
  );
};

export default ChatInput;
