import React from 'react';
import { View } from 'react-native';
import { Button } from '@ui/button';
import { useRouter } from 'expo-router';
import { Text } from '@ui/text';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import Constants from 'expo-constants';

cssInterop(Image, { className: 'style' });

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center p-3">
      <Image
        source={require('@assets/adaptive-icon.png')}
        className="aspect-square h-28"
        contentFit="contain"
      />
      <Text className="mt-4 font-bold" variant="h1">
        Welcome to nilGPT
      </Text>
      <Text className="text-gray-500" variant="small">
        Your secure and private AI assistant
      </Text>

      <View className="mt-8 flex w-full gap-3">
        <Button onPress={() => router.push('/auth/signin')}>
          <Text>Sign In</Text>
        </Button>
        <Button variant="outline" onPress={() => router.push('/auth/signup')}>
          <Text>Sign Up</Text>
        </Button>
      </View>

      <View className="absolute bottom-0 self-stretch px-5 py-3">
        <Text className="text-center text-xs text-gray-600">
          By agreeing to sign up you are agreeing to the{' '}
          <Text className="text-xs text-blue-600 underline">
            terms and services
          </Text>{' '}
          and{' '}
          <Text className="text-xs text-blue-600 underline">
            privacy policy
          </Text>
        </Text>
        <Text className="text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} nilGPT. All rights reserved.
        </Text>
        <Text className="text-center text-xs text-gray-600">
          v{Constants.expoConfig?.version}
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
