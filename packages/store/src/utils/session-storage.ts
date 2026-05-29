import { Platform } from 'react-native';
import {
  createJSONStorage,
  type PersistStorage,
  type StateStorage,
} from 'expo-zustand-persist';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const webSessionStateStorage: StateStorage = {
  getItem: (name) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.removeItem(name);
  },
};

type JsonStorageOptions = {
  reviver?: (key: string, value: unknown) => unknown;
  replacer?: (key: string, value: unknown) => unknown;
};

function assertPersistStorage<S>(
  storage: PersistStorage<S> | undefined,
): PersistStorage<S> {
  if (!storage) {
    throw new Error('Failed to create sessionStorage persist storage');
  }
  return storage;
}

export function createSessionStorageJSONStorage<S>(
  options?: JsonStorageOptions,
): PersistStorage<S> {
  return assertPersistStorage(
    createJSONStorage<S>(
      () => (Platform.OS === 'web' ? webSessionStateStorage : noopStorage),
      options,
    ),
  );
}

export const sessionStorageJSONStorage =
  createSessionStorageJSONStorage<unknown>();
