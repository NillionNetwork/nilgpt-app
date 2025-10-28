import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from '../theme';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <SafeAreaView className="flex-1">
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
