import { useContext } from "react";
import ThemeSchemeContext from "./ThemeSchemeContext";

export function useThemeScheme() {
  const context = useContext(ThemeSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context
}