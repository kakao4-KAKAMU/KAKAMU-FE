import type { AuthSnsSignUpProvider } from '@kakamu/types';
import { create } from 'zustand';
import { persist } from 'expo-zustand-persist';
import { createAsyncStorageJSONStorage } from '../utils/async-storage';

type AuthSlice = {
  /** 메모리 전용 — persist 대상 아님 */
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  pendingSnsProvider: AuthSnsSignUpProvider | null;
  pendingSnsToken: string | null;
  setPendingSnsSignUp: (provider: AuthSnsSignUpProvider, token: string) => void;
  clearPendingSnsSignUp: () => void;
};

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      pendingSnsProvider: null,
      pendingSnsToken: null,
      setPendingSnsSignUp: (provider, token) =>
        set({ pendingSnsProvider: provider, pendingSnsToken: token }),
      clearPendingSnsSignUp: () =>
        set({ pendingSnsProvider: null, pendingSnsToken: null }),
    }),
    {
      name: 'auth',
      storage: createAsyncStorageJSONStorage<AuthSlice>(),
      partialize: (state) =>
        ({
          pendingSnsProvider: state.pendingSnsProvider,
          pendingSnsToken: state.pendingSnsToken,
        }) as AuthSlice,
    },
  ),
);
