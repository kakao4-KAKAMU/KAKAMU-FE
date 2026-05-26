import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createJSONStorage,
  type PersistStorage,
  type StateStorage,
} from 'expo-zustand-persist';

/**
 * Zustand `persist` middleware용 `StateStorage`.
 * React Native AsyncStorage의 get/set/remove API를 사용합니다.
 *
 * @see https://react-native-async-storage.github.io/async-storage/docs/api
 */
export const asyncStorageStateStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};

type JsonStorageOptions = {
  reviver?: (key: string, value: unknown) => unknown;
  replacer?: (key: string, value: unknown) => unknown;
};

function assertPersistStorage<S>(
  storage: PersistStorage<S> | undefined,
): PersistStorage<S> {
  if (!storage) {
    throw new Error('Failed to create AsyncStorage persist storage');
  }
  return storage;
}

/**
 * AsyncStorage 기반 Zustand persist JSON storage.
 * `persist` 옵션의 `storage`에 전달합니다.
 *
 * @see https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data
 *
 * @example
 * ```ts
 * persist(
 *   (set) => ({ accessToken: null, setAccessToken: (t) => set({ accessToken: t }) }),
 *   {
 *     name: 'auth',
 *     storage: createAsyncStorageJSONStorage<Pick<AuthSlice, 'accessToken'>>(),
 *   },
 * )
 * ```
 */
export function createAsyncStorageJSONStorage<S>(
  options?: JsonStorageOptions,
): PersistStorage<S> {
  return assertPersistStorage(
    createJSONStorage<S>(() => asyncStorageStateStorage, options),
  );
}

/** 제네릭 없이 사용할 때의 기본 persist storage. */
export const asyncStorageJSONStorage =
  createAsyncStorageJSONStorage<unknown>();
