import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { ConditionalRender } from '@/components/utils';

export default function AccountLayout() {
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId()

  return (
    <ConditionalRender.Boolean
      condition={currentUserId}
      render={{
        true: <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="persona/index" options={{ headerShown: false, title: t('account.layout.persona') }} />
          <Stack.Screen name="persona/create" options={{ headerShown: false, title: t('account.layout.personaCreate') }} />
          <Stack.Screen name="persona/[id]" options={{ headerShown: false, title: t('account.layout.personaEdit') }} />
          <Stack.Screen name="profile/setting/index" options={{ headerShown: false, title: t('account.layout.profileSettings') }} />
          <Stack.Screen name="profile/setting/password" options={{ headerShown: false, title: t('account.layout.passwordChange') }} />
          <Stack.Screen name="feed/write/index" options={{ headerShown: false, title: t('account.layout.feedWrite') }} />
          <Stack.Screen name="feed/write/[id]" options={{ headerShown: false, title: t('account.layout.feedEdit') }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false, title: t('account.layout.personaChat') }} />
        </Stack>
      }}
    />
  );
}
