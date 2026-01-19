import { OTPInput } from 'input-otp-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Feather } from '@/components/ExpoIcon';
import { ExpoImage } from '@/components/Image';
import API from '@/services/API';
import { setPin } from '@/services/MMKV';
import { supabase } from '@/services/Supabase';
import { cn } from '@/utils/cn';
import { decryptWithPin } from '@/utils/encryption';
import { Button } from '@ui/button';
import { Text } from '@ui/text';

const PinScreen: React.FC = () => {
  const { data: encryptedChats } = API.useEncryptedChats();
  const [error, setError] = useState<string>('');

  const onComplete = (pin: string) => {
    if (encryptedChats) {
      if (encryptedChats.length === 0) {
        setPin(pin);
        return;
      }

      const firstChat = encryptedChats[0];
      const decryptedTitle = decryptWithPin(firstChat.title, pin);

      if (decryptedTitle && decryptedTitle.trim().length > 0) {
        setPin(pin);
      } else {
        setError('Invalid PIN. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex flex-1 items-center p-3">
      <Button
        variant="secondary"
        className="h-10 w-10 items-center justify-center self-start rounded-full"
        onPress={() => supabase.auth.signOut()}>
        <Feather
          name="chevron-left"
          size={16}
          className="absolute self-center color-yellow"
        />
      </Button>
      <ExpoImage
        source={require('@assets/splash-icon-dark.png')}
        className="mt-20 aspect-square h-28"
        contentFit="contain"
      />
      <Text className="mt-5 text-2xl font-bold">Enter your PIN</Text>
      <Text className="mb-5 text-center text-gray-400">
        This PIN will be used to encrypt your chats and never leaves your
        device. If you forget your PIN, you will lose access to your chats.
      </Text>

      <OTPInput
        maxLength={6}
        autoFocus
        keyboardType="number-pad"
        pattern="^[0-9]+$"
        onComplete={onComplete}
        onChange={() => setError('')}
        render={({ slots }) => (
          <View className="my-4 flex-row items-center justify-center gap-2">
            {slots.map((slot, idx) => (
              <View
                key={idx}
                className={cn(
                  'h-[50px] w-[50px] items-center justify-center rounded-lg border border-input bg-input/30',
                  {
                    'border-2': slot.isActive,
                  },
                )}>
                {slot.char !== null && (
                  <Text className="text-2xl font-medium text-foreground">
                    {slot.char}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      />
      {error && (
        <Text className="mt-2 text-center text-sm text-red-400">{error}</Text>
      )}
    </SafeAreaView>
  );
};

export default PinScreen;
