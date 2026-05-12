import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Bookmark, Clapperboard, Users } from 'lucide-react-native';
import { IntroFeatureCard } from './IntroFeatureCard';

type FeatureItem = {
  id: string;
  icon: LucideIcon;
  title: string;
};

type IntroFeatureCardListProps = {
  items?: FeatureItem[];
};

const DEFAULT_ITEMS: FeatureItem[] = [
  { id: 'persona', icon: Users, title: '페르소나별 취향' },
  { id: 'trailer', icon: Clapperboard, title: '예고편 판독' },
  { id: 'saved', icon: Bookmark, title: '카테고리 저장' },
];

export function IntroFeatureCardList({ items = DEFAULT_ITEMS }: IntroFeatureCardListProps) {
  return (
    <View className="flex-row gap-2">
      {items.map((item) => (
        <IntroFeatureCard key={item.id} icon={item.icon} title={item.title} />
      ))}
    </View>
  );
}

export type { FeatureItem as IntroFeatureItem };
