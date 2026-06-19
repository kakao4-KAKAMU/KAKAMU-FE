import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { PersonaListScreenContent } from '@/components/featured/persona/PersonaListScreenContent';
import { PersonaListScreenContentSkeleton } from '@/components/featured/persona/PersonaListScreenContent.skeleton';

export default function PersonaScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <AppSuspenseBoundary fallback={<PersonaListScreenContentSkeleton />}>
          <PersonaListScreenContent />
        </AppSuspenseBoundary>
      </View>
    </>
  );
}
