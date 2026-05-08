import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="persona" options={{ headerShown: true, title: '페르소나' }} />
      <Stack.Screen name="profile/setting" options={{ headerShown: true, title: '프로필 설정' }} />
      <Stack.Screen name="profile/my/saved/index" options={{ headerShown: true, title: '저장한 피드' }} />
      <Stack.Screen name="profile/my/saved/[category]" options={{ headerShown: true, title: '저장한 피드 카테고리' }} />
      <Stack.Screen name="profile/my/like" options={{ headerShown: true, title: '좋아한 피드' }} />
      <Stack.Screen name="feed/write/index" options={{ headerShown: true, title: '피드 작성' }} />
      <Stack.Screen name="feed/write/[id]" options={{ headerShown: true, title: '피드 수정' }} />
      <Stack.Screen name="chat/bot" options={{ headerShown: true, title: '페르소나 챗' }} />
      <Stack.Screen name="search/feed" options={{ headerShown: true, title: '피드 검색 결과' }} />
      <Stack.Screen name="search/person" options={{ headerShown: true, title: '사람 검색 결과' }} />
      <Stack.Screen name="search/movie" options={{ headerShown: true, title: '영화 검색 결과' }} />
    </Stack>
  );
}
