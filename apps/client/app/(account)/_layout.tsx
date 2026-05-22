import { Stack } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';

export default function AccountLayout() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="persona/index" options={{ headerShown: false, title: t('account.layout.persona') }} />
      <Stack.Screen name="persona/create" options={{ headerShown: false, title: t('account.layout.personaCreate') }} />
      <Stack.Screen name="profile/setting/index" options={{ headerShown: false, title: '프로필 설정' }} />
      <Stack.Screen name="profile/my/saved/[category]" options={{ headerShown: false, title: '저장한 피드 카테고리' }} />
      <Stack.Screen name="feed/write/index" options={{ headerShown: false, title: '피드 작성' }} />
      <Stack.Screen name="feed/write/[id]" options={{ headerShown: false, title: '피드 수정' }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false, title: '페르소나 챗' }} />
      <Stack.Screen name="search/feed" options={{ headerShown: false, title: '피드 검색 결과' }} />
      <Stack.Screen name="search/person" options={{ headerShown: false, title: '사람 검색 결과' }} />
      <Stack.Screen name="search/movie" options={{ headerShown: false, title: '영화 검색 결과' }} />
    </Stack>
  );
}
