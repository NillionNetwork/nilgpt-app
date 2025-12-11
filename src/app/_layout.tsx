import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSyncQueriesExternal } from 'react-query-external-sync';

import SplashScreenController from '@components/SplashScreenController';
import { NAV_THEME, THEME } from '@constants/theme';
import { AuthProvider, useAuthContext } from '@hooks/useAuthContext';
import '../../global.css';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
  duration: 800,
});

const queryClient = new QueryClient();

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true,
});

const RootNavigator = () => {
  const { isLoggedIn, isPinSet } = useAuthContext();
  const colorScheme = useColorScheme() ?? 'light';

  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831',
    deviceName: Platform.OS,
    platform: Platform.OS,
    deviceId: Platform.OS,
    enableLogs: false,
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME[colorScheme].background,
        },
      }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/signin" />
        <Stack.Screen name="auth/signup" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn && !isPinSet}>
        <Stack.Screen name="pin" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn && isPinSet}>
        <Stack.Screen name="chat" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView>
              <SplashScreenController />
              <StatusBar style="auto" />
              <KeyboardProvider>
                <RootNavigator />
              </KeyboardProvider>
              <PortalHost />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
