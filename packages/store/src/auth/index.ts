import type { AuthSnsSignUpProvider } from '@kakamu/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAsyncStorageJSONStorage } from '../utils/async-storage';

type AuthSlice = {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
  pendingSnsProvider: AuthSnsSignUpProvider | null;
  pendingSnsToken: string | null;
  setPendingSnsSignUp: (provider: AuthSnsSignUpProvider, token: string) => void;
  clearPendingSnsSignUp: () => void;
};

type AuthPersistedState = Pick<AuthSlice, 'accessToken'>;

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
      storage: createAsyncStorageJSONStorage<AuthPersistedState>(),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
