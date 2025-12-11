import CryptoJS from 'crypto-js';
import { getPin } from '@/services/MMKV';

export const encrypt = async (text: string) => {
  try {
    const pin = getPin();
    if (!pin) {
      throw new Error('No PIN available.');
    }

    const encryptedText = CryptoJS.AES.encrypt(text, pin).toString();
    return encryptedText;
  } catch (error) {
    console.error('[nilGPT encryption error]:', error);
    return null;
  }
};

export const decrypt = async (encryptedText: string) => {
  try {
    const pin = getPin();
    if (!pin) {
      throw new Error('No PIN available.');
    }

    const decryptedText = CryptoJS.AES.decrypt(encryptedText, pin).toString(
      CryptoJS.enc.Utf8,
    );
    return decryptedText;
  } catch (error) {
    console.error('[nilGPT decryption error]:', error);
    return encryptedText;
  }
};

export const decryptWithPin = (encryptedText: string, pin: string) => {
  try {
    const decryptedText = CryptoJS.AES.decrypt(encryptedText, pin).toString(
      CryptoJS.enc.Utf8,
    );
    return decryptedText;
  } catch (error) {
    console.error('[nilGPT decryption error]:', error);
    return null;
  }
};
