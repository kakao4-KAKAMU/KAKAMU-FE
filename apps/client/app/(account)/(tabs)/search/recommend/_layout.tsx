import { View } from 'react-native';
import { Slot } from 'expo-router';

import { RecommendSubTabs } from '@/components/featured/search/RecommendSubTabs';

export default function SearchRecommendLayout() {
  return (
    <View className="flex-1 gap-2">
      <RecommendSubTabs />
      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
