import 'react-native-gesture-handler';

import { Redirect, Stack, usePathname, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider, QueryCache } from '@kakamu/query';
import { AppErrorBoundary, ErrorAlertDialogProvider, PortalHost } from '@kakamu/ui';
import { getI18n, I18nextProvider } from '@kakamu/i18n';
import { ThemeSchemeProvider } from '@/components/themeScheme';
import * as Sentry from '@sentry/react-native';
import { ThemeColorProvider } from '@/components/themeColor/ThemeColorProvider';
import { useAuthStore, usePersonaStore } from '@kakamu/store';
import { ApiClientProvider } from '@/providers/ApiClientProvider';
import { restoreSessionFromRefreshToken } from '@/lib/auth/restore-session';
import { getBackendApiPrefixUrl } from '@/lib/env/backend-api-url';
import { ConditionalRender } from '@/components/utils';

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
  }
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.setOptions({
  duration: 2000,
  fade: true
})
SplashScreen.preventAutoHideAsync();

const isPersonaPath = (pathname: string) =>
  pathname === '/persona' || pathname.startsWith('/persona/');


const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});

type AccountFilterStatus = 'gotoGuest' |
'gotoAccountTabs' |
'none';

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  
  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      try {
        // @ts-expect-error expo-zustand-persist rehydrate
        await useAuthStore.persist.rehydrate();

        const prefixUrl = getBackendApiPrefixUrl();
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken && prefixUrl) {
          await restoreSessionFromRefreshToken(prefixUrl);
        }
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
    if (!authReady) {
      return;
    }

    SplashScreen.hideAsync();
  }, [authReady]);

  const accountStatus: AccountFilterStatus = useMemo(() => {
    if (!authReady) {
      return 'none';
    }

    const rootSegment = segments[0];
    const isAccountRoute = rootSegment === '(account)';
    const isGuestRoute = rootSegment === '(guest)';

    if (!isAuthenticated && isAccountRoute) {
      return 'gotoGuest';
    }

    if (isAuthenticated && isGuestRoute) {
      return 'gotoAccountTabs';
    }
    return 'none';
  }, [authReady, isAuthenticated, pathname, router, segments]);

  if (!authReady) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider>
          <I18nextProvider i18n={getI18n()}>
            <ThemeSchemeProvider>
              <ThemeColorProvider>
                <AppErrorBoundary>
                  <ErrorAlertDialogProvider>
                    <ConditionalRender
                      condition={accountStatus}
                      render={{
                        'gotoGuest': <Redirect href="/(guest)" />,
                        'gotoAccountTabs': <Redirect href="/(account)/(tabs)" />,
                        'none': <Stack
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen name="(guest)" />
                          <Stack.Screen name="(account)" />
                          <Stack.Screen name="(shared)" />
                        </Stack>
                      }}
                    />
                    
                    <PortalHost />
                  </ErrorAlertDialogProvider>
                </AppErrorBoundary>
              </ThemeColorProvider>
            </ThemeSchemeProvider>
          </I18nextProvider>
        </ApiClientProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

