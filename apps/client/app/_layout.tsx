import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import '../global.css';
import 'react-native-reanimated';
import { AppErrorBoundary, PortalHost } from '@kakamu/ui';
import { ColorSchemeProvider } from '@/components/ColorScheme/ColorSchemeProvider';
import { useColorScheme } from '@/components/ColorScheme/useColorScheme';
import { useColors } from '@/components/useColors';
import * as Sentry from '@sentry/react-native';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  routeChangeTimeoutMs: 1_000, // default: 1_000
  ignoreEmptyBackNavigationTransactions: true, // default: true
  useDispatchedActionData: true, // default: false
});
Sentry.init({
  dsn: "https://c975936198a658db66d7afd36e8bc6e2@o4511347737690113.ingest.us.sentry.io/4511347740180480",
  enableLogs: true,
  integrations: [navigationIntegration],
})

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppErrorBoundary>
      <ColorSchemeProvider>
        <ThemedRootStack />
        <PortalHost />
      </ColorSchemeProvider>
    </AppErrorBoundary>
  );
}

function ThemedRootStack() {
  const colors = useColors();

  const { colorScheme } = useColorScheme();

  const navigationTheme = useMemo<Theme>(
    () => ({
      ...DefaultTheme,
      dark: colorScheme === 'dark',
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        notification: colors.destructive,
      },
    }),
    [colors, colorScheme],
  );
  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.foreground,
          contentStyle: {
            backgroundColor: colors.background,
            color: colors.foreground
          }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
