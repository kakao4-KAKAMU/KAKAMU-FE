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
      <Stack.Screen name="signup-sns" options={{ title: t('guest.layout.signUpSns') }} />
      <Stack.Screen name="resetpassword" options={{ title: t('guest.layout.resetPassword') }} />
    </Stack>
  );
}
