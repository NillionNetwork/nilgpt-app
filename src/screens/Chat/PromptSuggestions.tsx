import { Button } from '@/components/ui/button';
import getPromptSuggestions from '@/utils/getPromptSuggestions';
import { View } from 'react-native';
import { Text } from '@ui/text';
import { IPromptSuggestionsProps } from './types';

const PromptSuggestions: React.FC<IPromptSuggestionsProps> = ({
  handleSendMessage,
  persona,
}) => {
  return (
    <View className="flex flex-1 items-center justify-center pt-10">
      <Text variant="h1">Welcome to nilGPT!</Text>
      <Text variant="muted">Ask anything privately and securely</Text>
      <View className="mt-8 flex items-center gap-3">
        {getPromptSuggestions(persona).map((suggestion, index) => (
          <Button
            key={index}
            onPress={() => handleSendMessage({ question: suggestion.prompt })}
            variant="outline"
            size="sm">
            <Text>{suggestion.emoji}</Text>
            <Text className="text-gray-500">{suggestion.prompt}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
};

export default PromptSuggestions;
