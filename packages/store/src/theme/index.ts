import type { ColorSchemeName } from 'react-native';
import { create } from 'zustand';
import { persist } from 'expo-zustand-persist';
import { createAsyncStorageJSONStorage } from '../utils/async-storage';

type ThemeName = NonNullable<ColorSchemeName>;

type ThemeSlice = {
  theme: ThemeName;
  setTheme: (scheme: ColorSchemeName) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeSlice>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (scheme) => set({ theme: scheme ?? 'light' }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'theme',
      storage: createAsyncStorageJSONStorage<ThemeSlice>(),
      partialize: (state) =>
        ({
          theme: state.theme,
        }) as ThemeSlice,
    },
  ),
);
