import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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

const RootNavigator = () => {
  const { isLoggedIn } = useAuthContext();
  const colorScheme = useColorScheme() ?? 'light';

  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831',
    deviceName: Platform?.OS || 'web',
    platform: Platform?.OS || 'web',
    deviceId: Platform?.OS || 'web',
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
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="chat/[id]" />
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
              <SafeAreaView className="flex-1 bg-background">
                <SplashScreenController />
                <StatusBar style="auto" />
                <RootNavigator />
              </SafeAreaView>
              <PortalHost />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
