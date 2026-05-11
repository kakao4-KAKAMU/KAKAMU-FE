import { Appearance, Platform } from "react-native";
import type { ColorSchemeName } from "react-native";
import { useState } from "react";
import ThemeSchemeContext from "./ThemeSchemeContext";

export function ThemeSchemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = Appearance.getColorScheme();
  const [colorSchemeState, setColorSchemeState] = useState<ColorSchemeName>(colorScheme ?? 'light');
  const setColorScheme = (scheme: ColorSchemeName) => {
    const newTheme = scheme ?? 'light'
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Appearance.setColorScheme(newTheme)
      return
    }

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    setColorSchemeState(newTheme)
  }
  Appearance.addChangeListener((color) => {
    setColorSchemeState(color.colorScheme)
  })
  const toggleColorScheme = () => {
    setColorScheme(colorSchemeState === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeSchemeContext.Provider value={{ colorScheme: colorSchemeState, setColorScheme: setColorScheme, toggleColorScheme: toggleColorScheme }}>
      {children}
    </ThemeSchemeContext.Provider>
  );  
}
