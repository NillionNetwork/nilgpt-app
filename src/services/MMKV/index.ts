import { createMMKV } from 'react-native-mmkv';
import { MMKV_KEYS } from './constants';

export const pinStore = createMMKV({
  id: 'nilgpt-pin',
});

export const setPin = (pin: string) => {
  pinStore.set(MMKV_KEYS.PIN_STORE.PIN, pin);
};

export const getPin = () => {
  return pinStore.getString(MMKV_KEYS.PIN_STORE.PIN);
};

export const deletePin = () => {
  pinStore.remove(MMKV_KEYS.PIN_STORE.PIN);
};

export const hasPin = () => {
  return pinStore.contains(MMKV_KEYS.PIN_STORE.PIN);
};
