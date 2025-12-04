import {
  AntDesign as ExpoAntDesign,
  Feather as ExpoFeather,
  FontAwesome6 as ExpoFontAwesome6,
} from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

export const AntDesign = cssInterop(ExpoAntDesign, {
  className: { target: 'style' },
});

export const Feather = cssInterop(ExpoFeather, {
  className: { target: 'style' },
});

export const FontAwesome6 = cssInterop(ExpoFontAwesome6, {
  className: { target: 'style' },
});
