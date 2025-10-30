import { AntDesign as ExpoAntDesign } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

export const AntDesign = cssInterop(ExpoAntDesign, {
  className: { target: 'style' },
});
