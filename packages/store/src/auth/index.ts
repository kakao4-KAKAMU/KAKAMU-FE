import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAsyncStorageJSONStorage } from '../utils/async-storage';

type AuthSlice = {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
};

type AuthPersistedState = Pick<AuthSlice, 'accessToken'>;

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'auth',
      storage: createAsyncStorageJSONStorage<AuthPersistedState>(),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
