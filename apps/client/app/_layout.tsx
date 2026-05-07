import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import '../global.css';
import 'react-native-reanimated';
import { AppErrorBoundary, PortalHost } from '@kakamu/ui';
import { useThemeScheme, ThemeSchemeProvider } from '@/components/themeScheme';
import * as Sentry from '@sentry/react-native';
import { ThemeColorProvider } from '@/components/themeColor/ThemeColorProvider';
import { useColors } from '@/components/themeColor/useColors';

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
    <ThemeSchemeProvider>
      <ThemeColorProvider>
        <AppErrorBoundary>
          <ThemedRootStack />
          <PortalHost />
        </AppErrorBoundary>
      </ThemeColorProvider>
    </ThemeSchemeProvider>
  );
}

function ThemedRootStack() {
  const colors = useColors();

  return (
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors['--card'] },
          headerTintColor: colors['--foreground'],
          contentStyle: {
            backgroundColor: colors['--background'],
            color: colors['--foreground']
          }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
