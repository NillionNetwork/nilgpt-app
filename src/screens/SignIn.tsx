import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import API from '@services/API';
import { supabase } from '@services/Supabase';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Text } from '@ui/text';

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keepMePosted, setKeepMePosted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const passwordInputRef = useRef<TextInput>(null);
  const { mutate: createUserMutation } = API.useCreateUser();

  const createUser = () => {
    createUserMutation();
  };

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

      createUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: email.trim(),
            email_consent: keepMePosted,
          },
        },
      });

      if (error) {
        throw error;
      }

      createUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'signin') {
      signInWithEmail();
    } else {
      signUpWithEmail();
    }
  };

  return (
    <SafeAreaView className="flex flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex flex-1">
        <ScrollView
          contentContainerClassName="flex flex-1 items-center justify-center gap-4 p-3"
          keyboardDismissMode="interactive">
          <Text variant="h1" className="mb-6 font-bold">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Text>

          <View className="self-stretch">
            <Text className="mb-2 font-medium text-gray-700">Email</Text>
            <Input
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCorrect={false}
              autoFocus
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

          {mode === 'signup' && (
            <View className="flex flex-row items-center gap-1 self-stretch">
              <Checkbox
                id="keepMePosted"
                checked={keepMePosted}
                onCheckedChange={setKeepMePosted}
              />
              <Label
                htmlFor="keepMePosted"
                className="text-xs text-gray-600"
                onPress={() => setKeepMePosted(!keepMePosted)}>
                Keep me posted on what&apos;s new via marketing emails
              </Label>
            </View>
          )}

          <Button
            className="mt-4 self-stretch"
            disabled={loading || !!error || !email || !password}
            onPress={handleSubmit}>
            <Text>
              {loading
                ? 'Loading...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Sign Up'}
            </Text>
          </Button>

          {error && (
            <Text className="-mt-1 text-center text-xs text-red-500">
              {error}
            </Text>
          )}
          <View className="flex flex-row items-center justify-center self-stretch">
            <Text className="text-center text-gray-600">
              {mode === 'signin'
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
            </Text>
            <Pressable
              onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              <Text className="text-blue-600 underline">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
