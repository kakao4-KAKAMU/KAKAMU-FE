import { createContext } from "react";

const ColorSchemeContext = createContext<{
  colorScheme: string;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  toggleColorScheme: () => void;
}>({
  colorScheme: 'light',
  setColorScheme: () => { },
  toggleColorScheme: () => { }
});

export default ColorSchemeContext;