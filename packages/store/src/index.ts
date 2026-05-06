import { create } from 'zustand';

type AuthSlice = {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
};

export const useAuthStore = create<AuthSlice>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));
