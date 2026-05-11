import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';

type IntroFeatureCardProps = {
  icon: LucideIcon;
  title: string;
};

export function IntroFeatureCard({ icon, title }: IntroFeatureCardProps) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-card/80 px-3 py-3">
      <TextClassContext.Provider value="text-foreground">
        <Icon as={icon} size={18} />
        <Text className="mt-1.5 text-[12px] font-extrabold leading-none">{title}</Text>
      </TextClassContext.Provider>
    </View>
  );
}
