import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const REFRESH_TOKEN_KEY = 'kakamu.auth.refresh_token';
const LEGACY_REFRESH_WEB_KEY = 'kakamu.auth.refresh_token.web';

function isNativePlatform(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export async function getRefreshToken(): Promise<string | null> {
  if (isNativePlatform()) {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }
  return AsyncStorage.getItem(LEGACY_REFRESH_WEB_KEY);
}

export async function saveRefreshToken(token: string): Promise<void> {
  if (isNativePlatform()) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
    return;
  }
  await AsyncStorage.setItem(LEGACY_REFRESH_WEB_KEY, token);
}

export async function clearRefreshToken(): Promise<void> {
  if (isNativePlatform()) {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    return;
  }
  await AsyncStorage.removeItem(LEGACY_REFRESH_WEB_KEY);
}
