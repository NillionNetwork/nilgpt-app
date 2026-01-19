import { ScrollView, View } from 'react-native';

import { Button } from '@ui/button';
import getPromptSuggestions from '@/utils/getPromptSuggestions';
import { Text } from '@ui/text';
import { IPromptSuggestionsProps } from './types';

const PromptSuggestions: React.FC<IPromptSuggestionsProps> = ({
  handleSendMessage,
  persona,
}) => {
  return (
    <ScrollView
      keyboardDismissMode="interactive"
      contentContainerClassName="flex flex-1 items-center justify-center pt-10">
      <Text variant="h1">Welcome to nilGPT!</Text>
      <Text variant="muted">Ask anything privately and securely</Text>
      <View className="mt-8 flex items-center gap-3">
        {getPromptSuggestions(persona).map((suggestion, index) => (
          <Button
            key={index}
            onPress={() =>
              handleSendMessage({ question: suggestion.prompt, persona })
            }
            variant="outline"
            size="sm">
            <Text>
              {suggestion.emoji} {suggestion.prompt}
            </Text>
          </Button>
        ))}
      </View>
    </ScrollView>
  );
};

export default PromptSuggestions;
