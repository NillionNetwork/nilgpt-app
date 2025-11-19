import {
  AntDesign as ExpoAntDesign,
  Feather as ExpoFeather,
} from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

export const AntDesign = cssInterop(ExpoAntDesign, {
  className: { target: 'style' },
});

export const Feather = cssInterop(ExpoFeather, {
  className: { target: 'style' },
});
