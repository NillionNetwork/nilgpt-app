import type { ExpoConfig, ConfigContext } from 'expo/config';
import packageJson from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'nilGPT',
  slug: 'nilgpt',
  owner: 'nillion-labs',
  scheme: 'nilgpt',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: 'com.nillion.nilgpt',
    supportsTablet: false,
    usesAppleSignIn: false,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.nillion.nilgpt',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  extra: {
    eas: {
      projectId: 'a4354395-f8aa-4d5a-84aa-9e2f54304d37',
    },
  },
  version: packageJson.version,
});
