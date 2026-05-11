import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';

export default function GuestLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: t('guest.layout.intro') }} />
      <Stack.Screen name="signin" options={{ title: t('guest.layout.signIn') }} />
      <Stack.Screen name="signup" options={{ title: t('guest.layout.signUp') }} />
      <Stack.Screen name="findpassword/index" options={{ title: t('guest.layout.findPassword') }} />
      <Stack.Screen name="findpassword/done" options={{ title: t('guest.layout.findPassword') }} />
      <Stack.Screen name="findpassword/reset" options={{ title: t('guest.layout.resetPassword') }} />
    </Stack>
  );
}
