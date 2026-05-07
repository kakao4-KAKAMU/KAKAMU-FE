import { createContext } from "react";
import type { ColorSchemeName } from "react-native";

const ThemeSchemeContext = createContext<{
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: ColorSchemeName) => void;
  toggleColorScheme: () => void;
}>({
  colorScheme: 'light',
  setColorScheme: () => { },
  toggleColorScheme: () => { }
});

export default ThemeSchemeContext;