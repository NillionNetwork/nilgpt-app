import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_ROUTES } from '@constants/routes';
import API from '@services/API';
import { supabase } from '@services/Supabase';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Text } from '@ui/text';

const SignInScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  const { mutateAsync: createUserMutation } = API.useCreateUser();

  const signInWithEmail = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
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
    signInWithEmail();
  };

  return (
    <SafeAreaView className="flex flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex flex-1">
        <ScrollView
          contentContainerClassName="flex flex-1 items-center justify-center gap-4 p-3"
          keyboardDismissMode="interactive">
          <Text variant="h1" className="mb-6 font-bold">
            Sign In
          </Text>

          <View className="self-stretch">
            <Text className="mb-2 font-medium text-gray-700">Email</Text>
            <Input
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCorrect={false}
              autoComplete="email"
              autoCapitalize="none"
              placeholder="Email"
              returnKeyType="next"
              maxLength={100}
              submitBehavior="submit"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          <View className="self-stretch">
            <Text className="mb-2 font-medium text-gray-700">Password</Text>
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

          <Button
            className="mt-4 self-stretch"
            disabled={loading || !email || !password}
            onPress={handleSubmit}>
            <Text>{loading ? 'Loading...' : 'Sign In'}</Text>
          </Button>

          {error && (
            <Text className="-mt-1 text-center text-xs text-red-500">
              {error}
            </Text>
          )}
          <View className="flex flex-row items-center justify-center self-stretch">
            <Text className="text-center text-gray-600">
              Don&apos;t have an account?
            </Text>
            <Pressable onPress={() => router.replace(APP_ROUTES.AUTH.SIGN_UP)}>
              <Text className="text-blue-600 underline">Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
