import { Appearance, Platform } from "react-native";
import type { ColorSchemeName } from "react-native";
import { useCallback, useEffect, useState } from "react";
import ThemeSchemeContext from "./ThemeSchemeContext";

export function ThemeSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorSchemeState, setColorSchemeState] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');
  const setColorScheme = useCallback((scheme: ColorSchemeName) => {
    const newTheme = scheme ?? 'light'
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Appearance.setColorScheme(newTheme)
      return
    }

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    setColorSchemeState(newTheme)
  }, [])
  useEffect(() => {
    const subscription = Appearance.addChangeListener((color) => {
      setColorSchemeState(color.colorScheme)
    })
    return () => {
      subscription.remove()
    }
  }, [])
  const toggleColorScheme = useCallback(() => {
    setColorScheme(colorSchemeState === 'light' ? 'dark' : 'light')
  }, [colorSchemeState, setColorScheme])

  return (
    <ThemeSchemeContext.Provider value={{ colorScheme: colorSchemeState, setColorScheme: setColorScheme, toggleColorScheme: toggleColorScheme }}>
      {children}
    </ThemeSchemeContext.Provider>
  );  
}
