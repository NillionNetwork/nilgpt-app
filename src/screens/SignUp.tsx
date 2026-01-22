import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_ROUTES } from '@constants/routes';
import API from '@services/API';
import { supabase } from '@services/Supabase';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Text } from '@ui/text';
import { ExpoImage } from '@/components/Image';
import getEmailFromUsername from '@/utils/getEmailFromUsername';

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keepMePosted, setKeepMePosted] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);

  const { mutateAsync: createUserMutation } = API.useCreateUser();

  const signUpWithEmail = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email: getEmailFromUsername(username.trim()),
        password: password,
        options: {
          data: {
            name: username.trim(),
            email_consent: keepMePosted,
          },
        },
      });

      if (error) {
        throw error;
      }

      await createUserMutation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    signUpWithEmail();
  };

  return (
    <SafeAreaView className="flex flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex flex-1">
        <ScrollView
          contentContainerClassName="flex flex-1 items-center justify-center gap-4 p-3"
          keyboardDismissMode="interactive">
          <ExpoImage
            source={require('@assets/logo-dark.svg')}
            className="aspect-square h-20"
            contentFit="contain"
          />
          <Text variant="h1" className="mb-6 font-bold">
            Sign Up
          </Text>

          <View className="self-stretch">
            <Text className="mb-2 font-medium text-gray-200">Username</Text>
            <Input
              onChangeText={(text) => setUsername(text)}
              value={username}
              keyboardType="default"
              textContentType="username"
              autoCorrect={false}
              autoComplete="username"
              autoCapitalize="none"
              placeholder="Username"
              returnKeyType="next"
              maxLength={100}
              submitBehavior="submit"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          <View className="self-stretch">
            <Text className="mb-2 font-medium text-gray-200">Password</Text>
            <Input
              ref={passwordInputRef}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
              placeholder="Password"
              returnKeyType="done"
              textContentType="password"
              autoComplete="password"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <View className="flex flex-row items-center gap-1 self-stretch">
            <Checkbox
              id="keepMePosted"
              checked={keepMePosted}
              onCheckedChange={setKeepMePosted}
            />
            <Label
              htmlFor="keepMePosted"
              className="text-xs text-gray-300"
              onPress={() => setKeepMePosted(!keepMePosted)}>
              Keep me posted on what&apos;s new via marketing emails
            </Label>
          </View>

          <Button
            className="mt-4 self-stretch"
            disabled={loading || !username.trim() || !password}
            onPress={handleSubmit}>
            <Text>{loading ? 'Loading...' : 'Sign Up'}</Text>
          </Button>

          {error && (
            <Text className="-mt-1 text-center text-xs text-red-400">
              {error}
            </Text>
          )}
          <View className="flex flex-row items-center justify-center gap-1 self-stretch">
            <Text className="text-center text-gray-200">
              Already have an account?
            </Text>
            <Pressable onPress={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}>
              <Text className="text-blue-400 underline">Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
