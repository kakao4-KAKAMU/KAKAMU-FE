import { Appearance, Platform } from "react-native";
import { useState } from "react";
import ColorSchemeContext from "./ColorSchemeContext";
import { View } from "react-native-css/components";

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = Appearance.getColorScheme();
  const [colorSchemeState, setColorSchemeState] = useState<string>(colorScheme ?? 'light');
  const setColorScheme = (scheme: 'light' | 'dark') => {
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
    <ColorSchemeContext.Provider value={{ colorScheme: colorSchemeState, setColorScheme: setColorScheme, toggleColorScheme: toggleColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );  
}
