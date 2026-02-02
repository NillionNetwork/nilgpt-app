import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

export const ExpoImage = cssInterop(Image, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'tintColor',
    },
  },
});
