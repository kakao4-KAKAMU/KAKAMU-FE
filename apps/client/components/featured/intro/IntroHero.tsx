import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Icon, Text } from '@kakamu/ui';

type IntroHeroProps = {
  badge?: string;
  title: string;
  description: string;
};

export function IntroHero({
  badge = 'persona-powered cinema social',
  title,
  description,
}: IntroHeroProps) {
  return (
    <View className="flex-col gap-3 pt-2">
      <View className="flex-row items-center gap-2 self-start rounded-full border border-border bg-card/60 px-2.5 py-1.5">
        <Icon as={Sparkles} size={14} />
        <Text className="text-[11px] font-extrabold text-foreground leading-none">{badge}</Text>
      </View>

      <Text className="text-[34px] font-extrabold text-foreground leading-[38px]">{title}</Text>
      <Text className="text-[14px] font-normal text-muted-foreground leading-[20px]">
        {description}
      </Text>
    </View>
  );
}
