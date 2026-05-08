import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@kakamu/ui';

export default function SonarScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '소나' }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16 }}>
        <Text selectable>영화 예고편 선호(좋아요/싫어요) 선택 페이지</Text>
      </ScrollView>
    </>
  );
}
