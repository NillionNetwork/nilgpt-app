import React, { useRef, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { supabase } from '@services/Supabase';
import { Button } from '@ui/button';
import { Text } from '@ui/text';
import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Checkbox } from '@ui/checkbox';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keepMePosted, setKeepMePosted] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const passwordInputRef = useRef<TextInput>(null);

  const signInWithEmail = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
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
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      if (!session) Alert.alert('Success', 'Please check your inbox for email verification!');
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
    <View className="flex flex-1 gap-4 p-3">
      <Text variant="h3" className="mb-6 text-left">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Text>

      <View className="self-stretch">
        <Text className="mb-2 text-sm font-medium text-gray-700">Email</Text>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          placeholder="Email"
          returnKeyType="next"
          autoFocus
          maxLength={100}
          submitBehavior="submit"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
      </View>

      <View className="self-stretch">
        <Text className="mb-2 text-sm font-medium text-gray-700">Password</Text>
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
        <Checkbox id="keepMePosted" checked={keepMePosted} onCheckedChange={setKeepMePosted} />
        <Label
          htmlFor="keepMePosted"
          className="text-xs text-gray-600"
          onPress={() => setKeepMePosted(!keepMePosted)}>
          Keep me posted on what&apos;s new via marketing emails
        </Label>
      </View>

      <Button className="mt-4 self-stretch" disabled={loading} onPress={handleSubmit}>
        <Text>{loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}</Text>
      </Button>

      {error && <Text className="-mt-1 text-center text-xs text-red-500">{error}</Text>}

      <View className="flex flex-row items-center justify-center self-stretch">
        <Text className="text-center text-sm text-gray-600">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
        </Text>
        <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          <Text className="text-sm text-blue-600 underline">
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </Text>
        </Pressable>
      </View>

      {mode === 'signup' && (
        <View className="mt-2 self-stretch">
          <Text className="text-center text-xs text-gray-600">
            By agreeing to sign up you are agreeing to the{' '}
            <Text className="text-xs text-blue-600 underline">terms and services</Text> and{' '}
            <Text className="text-xs text-blue-600 underline">privacy policy</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default AuthScreen;
