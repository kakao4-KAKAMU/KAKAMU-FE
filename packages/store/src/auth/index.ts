import type { AuthSnsSignUpProvider } from '@kakamu/types';
import { create } from 'zustand';
import { persist } from 'expo-zustand-persist';
import { createAsyncStorageJSONStorage } from '../utils/async-storage';

type AuthSlice = {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null, refreshToken: string | null) => void;
  pendingSnsProvider: AuthSnsSignUpProvider | null;
  pendingSnsToken: string | null;
  setPendingSnsSignUp: (provider: AuthSnsSignUpProvider, token: string) => void;
  clearPendingSnsSignUp: () => void;
};

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
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
      partialize: (state) => ({
        ...state,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  ),
);
