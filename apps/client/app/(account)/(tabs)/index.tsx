import { View } from 'react-native';

import { AppSuspenseBoundary } from '@/components/error-boundary';
import { MainFeedScreenContent } from '@/components/featured/mainFeed';

function MainFeedScreenFallback() {
  return <View className="flex-1 bg-background" />;
}

export default function MainFeedScreen() {
  return (
    <AppSuspenseBoundary fallback={<MainFeedScreenFallback />}>
      <MainFeedScreenContent />
    </AppSuspenseBoundary>
  );
}
