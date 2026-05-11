import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function ProfileSettingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '프로필 설정' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <Text selectable>페르소나 이동 및 알림 설정 페이지</Text>
      </ScrollView>
    </>
  );
}
