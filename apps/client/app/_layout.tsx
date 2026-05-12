import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import '../global.css';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@kakamu/query';
import { AppErrorBoundary, ErrorAlertDialogProvider, PortalHost } from '@kakamu/ui';
import { getI18n, I18nextProvider } from '@kakamu/i18n';
import { ThemeSchemeProvider } from '@/components/themeScheme';
import * as Sentry from '@sentry/react-native';
import { ThemeColorProvider } from '@/components/themeColor/ThemeColorProvider';
import { useAuthStore } from '@kakamu/store';

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
  initialRouteName: '(guest)',
  guest: {
    path: '(guest)',
    initialRouteName: 'index',
  },
  account: {
    path: '(account)',
    initialRouteName: 'index',
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.setOptions({
  duration: 2000,
  fade: true
})
SplashScreen.preventAutoHideAsync();

const ACCOUNT_ONLY_PREFIXES = [
  '/persona',
  '/profile/my',
  '/profile/setting',
  '/chat',
  '/sonar',
  '/feed/write',
  '/search',
];

const GUEST_ONLY_PREFIXES = ['/signin', '/signup'];

const startsWithPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const isAppReady = authReady && bootstrapReady;

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      try {
        await Promise.resolve();
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    };

    restoreAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const runBootstrap = async () => {
      try {
        await Promise.resolve();
      } finally {
        if (isMounted) {
          setBootstrapReady(true);
        }
      }
    };

    runBootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    SplashScreen.hideAsync();
  }, [isAppReady]);

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    const rootSegment = segments[0];
    const isAccountRoute = rootSegment === '(account)';
    const isGuestRoute = rootSegment === '(guest)';
    const isGroupedRoute = isAccountRoute || isGuestRoute;
    const isAccountOnlyCommonRoute = startsWithPrefix(pathname, ACCOUNT_ONLY_PREFIXES);
    const isGuestOnlyCommonRoute = startsWithPrefix(pathname, GUEST_ONLY_PREFIXES);

    if (isAuthenticated && !isAccountRoute) {
      if (isGuestRoute || isGuestOnlyCommonRoute) {
        router.replace('/persona');
      }
      return;
    }

    if (!isAuthenticated && (isAccountRoute || (!isGroupedRoute && isAccountOnlyCommonRoute))) {
      router.replace('/(guest)');
      return;
    }
  }, [isAppReady, isAuthenticated, pathname, router, segments]);

  if (!isAppReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={getI18n()}>
        <ThemeSchemeProvider>
          <ThemeColorProvider>
            <AppErrorBoundary>
              <ErrorAlertDialogProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="(guest)" />
                  <Stack.Screen name="(account)" />
                  <Stack.Screen name="profile/[id]" />
                  <Stack.Screen name="feed/[id]" />
                </Stack>
                <PortalHost />
              </ErrorAlertDialogProvider>
            </AppErrorBoundary>
          </ThemeColorProvider>
        </ThemeSchemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

