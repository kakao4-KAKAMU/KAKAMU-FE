import { DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { VariableContextProvider } from 'nativewind';
import { useThemeScheme } from '../themeScheme';
import { ColorSchemeName, Platform, View } from 'react-native';
import { parse, formatRgb } from 'culori'
import { ColorContext } from './ColorContext';
import { TextClassProvider } from '@kakamu/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';

export type ThemeVariables = Record<`--${string}`, string>

const LIGHT_THEME: ThemeVariables = {
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.153 0.006 107.1)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.153 0.006 107.1)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.153 0.006 107.1)',
  '--primary': 'oklch(0.52 0.105 223.128)',
  '--primary-foreground': 'oklch(0.984 0.019 200.873)',
  '--secondary': 'oklch(0.967 0.001 286.375)',
  '--secondary-foreground': 'oklch(0.21 0.006 285.885)',
  '--muted': 'oklch(0.966 0.005 106.5)',
  '--muted-foreground': 'oklch(0.58 0.031 107.3)',
  '--accent': 'oklch(0.966 0.005 106.5)',
  '--accent-foreground': 'oklch(0.228 0.013 107.4)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--border': 'oklch(0.93 0.007 106.5)',
  '--input': 'oklch(0.93 0.007 106.5)',
  '--ring': 'oklch(0.737 0.021 106.9)',
  '--chart-1': 'oklch(0.871 0.15 154.449)',
  '--chart-2': 'oklch(0.723 0.219 149.579)',
  '--chart-3': 'oklch(0.627 0.194 149.214)',
  '--chart-4': 'oklch(0.527 0.154 150.069)',
  '--chart-5': 'oklch(0.448 0.119 151.328)',
  '--sidebar': 'oklch(0.988 0.003 106.5)',
  '--sidebar-foreground': 'oklch(0.153 0.006 107.1)',
  '--sidebar-primary': 'oklch(0.609 0.126 221.723)',
  '--sidebar-primary-foreground': 'oklch(0.984 0.019 200.873)',
  '--sidebar-accent': 'oklch(0.966 0.005 106.5)',
  '--sidebar-accent-foreground': 'oklch(0.228 0.013 107.4)',
  '--sidebar-border': 'oklch(0.93 0.007 106.5)',
  '--sidebar-ring': 'oklch(0.737 0.021 106.9)',
}

const DARK_THEME: ThemeVariables = {
  '--background': 'oklch(0.153 0.006 107.1)',
  '--foreground': 'oklch(0.988 0.003 106.5)',
  '--card': 'oklch(0.228 0.013 107.4)',
  '--card-foreground': 'oklch(0.988 0.003 106.5)',
  '--popover': 'oklch(0.228 0.013 107.4)',
  '--popover-foreground': 'oklch(0.988 0.003 106.5)',
  '--primary': 'oklch(0.45 0.085 224.283)',
  '--primary-foreground': 'oklch(0.984 0.019 200.873)',
  '--secondary': 'oklch(0.274 0.006 286.033)',
  '--secondary-foreground': 'oklch(0.985 0 0)',
  '--muted': 'oklch(0.286 0.016 107.4)',
  '--muted-foreground': 'oklch(0.737 0.021 106.9)',
  '--accent': 'oklch(0.286 0.016 107.4)',
  '--accent-foreground': 'oklch(0.988 0.003 106.5)',
  '--destructive': 'oklch(0.704 0.191 22.216)',
  '--border': 'oklch(1 0 0 / 10%)',
  '--input': 'oklch(1 0 0 / 15%)',
  '--ring': 'oklch(0.58 0.031 107.3)',
  '--chart-1': 'oklch(0.871 0.15 154.449)',
  '--chart-2': 'oklch(0.723 0.219 149.579)',
  '--chart-3': 'oklch(0.627 0.194 149.214)',
  '--chart-4': 'oklch(0.527 0.154 150.069)',
  '--chart-5': 'oklch(0.448 0.119 151.328)',
  '--sidebar': 'oklch(0.228 0.013 107.4)',
  '--sidebar-foreground': 'oklch(0.988 0.003 106.5)',
  '--sidebar-primary': 'oklch(0.715 0.143 215.221)',
  '--sidebar-primary-foreground': 'oklch(0.302 0.056 229.695)',
  '--sidebar-accent': 'oklch(0.286 0.016 107.4)',
  '--sidebar-accent-foreground': 'oklch(0.988 0.003 106.5)',
  '--sidebar-border': 'oklch(1 0 0 / 10%)',
  '--sidebar-ring': 'oklch(0.58 0.031 107.3)',
}

const THEME = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  unspecified: LIGHT_THEME
}

type ThemeColorProviderProps = {
  children: React.ReactNode
  colors?: Record<ColorSchemeName, ThemeVariables>,
  values?: ThemeVariables
}

export function ThemeColorProvider({ children, colors }: ThemeColorProviderProps) {
  const { colorScheme } = useThemeScheme()
  const theme = useMemo(() => {
    const choosenTheme = Object.assign({}, THEME[colorScheme], colors?.[colorScheme] ?? {})
    const parsedTheme = Object.fromEntries(Object.entries(choosenTheme).map(([key, value]) => [key, formatRgb(parse(value as string))])) as ThemeVariables
    return parsedTheme
  }, [colorScheme, colors])

  useEffect(() => {
    if(Platform.OS !== 'web') {
      return
    }
    // TODO: on web platform, apply theme to document.documentElement.style.setProperty(key, value)
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    return () => {
      Object.keys(theme).forEach((key) => {
        document.documentElement.style.removeProperty(key)
      })
    }
  }, [theme])

  const navigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      primary: theme['--primary'],
      background: theme['--background'],
      card: theme['--card'],
      text: theme['--foreground'],
      border: theme['--border'],
      notification: theme['--destructive'],
    },
  }

  const safeAreaInsets = useSafeAreaInsets();
  const paddingBottom = Platform.OS === 'android' ? safeAreaInsets.bottom : 0;
  return (
    <ColorContext.Provider value={theme}>
      <VariableContextProvider value={theme}>
        <ThemeProvider value={navigationTheme}>
          <TextClassProvider value="text-foreground">
            <View
              className="bg-background h-full w-full"
              style={{
                paddingTop: safeAreaInsets.top,
                paddingBottom: paddingBottom,
                paddingLeft: safeAreaInsets.left,
                paddingRight: safeAreaInsets.right
              }}>
              {children}
            </View>
          </TextClassProvider>
        </ThemeProvider>
      </VariableContextProvider>
    </ColorContext.Provider>
  )
}