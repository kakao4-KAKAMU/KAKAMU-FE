import { Appearance, Platform } from "react-native";
import type { ColorSchemeName } from "react-native";
import { useCallback, useEffect } from "react";
import { useThemeStore } from "@kakamu/store";
import ThemeSchemeContext from "./ThemeSchemeContext";

export function ThemeSchemeProvider({ children }: { children: React.ReactNode }) {
  const colorSchemeState = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setColorScheme = useCallback((scheme: ColorSchemeName) => {
    const newTheme = scheme ?? 'light'
    setTheme(newTheme)
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Appearance.setColorScheme(newTheme)
      return
    }

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }, [setTheme])
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(colorSchemeState)
      return
    }

    Appearance.setColorScheme(colorSchemeState)
  }, [colorSchemeState])
  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorSchemeState === 'light' ? 'dark' : 'light')
  }, [colorSchemeState, setColorScheme])

  return (
    <ThemeSchemeContext.Provider value={{ colorScheme: colorSchemeState, setColorScheme: setColorScheme, toggleColorScheme: toggleColorScheme }}>
      {children}
    </ThemeSchemeContext.Provider>
  );  
}
