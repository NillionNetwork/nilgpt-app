import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from '../theme';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';
import { useAuthContext, AuthProvider } from '@hooks/useAuthContext';
import { SplashScreenController } from '@/components/SplashScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootNavigator = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/signin" />
        <Stack.Screen name="auth/signup" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="chat/index" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <SafeAreaView className="flex-1">
              <SplashScreenController />
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <RootNavigator />
            </SafeAreaView>
            <PortalHost />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
