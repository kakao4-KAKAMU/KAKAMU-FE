import { View } from 'react-native';
import { Text } from '@kakamu/ui';

type PersonaIntroProps = {
  title: string;
  description: string;
};

export function PersonaIntro({ title, description }: PersonaIntroProps) {
  return (
    <View className="w-full flex-col items-center gap-2.5">
      <Text className="w-full text-center text-[28px] font-extrabold leading-tight text-foreground">
        {title}
      </Text>
      <Text className="w-full text-center text-sm font-normal leading-[1.45] text-muted-foreground">
        {description}
      </Text>
    </View>
  );
}
