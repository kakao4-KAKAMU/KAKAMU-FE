import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';

type ProfileSubpageHeaderProps = {
  title: string;
  onBackPress?: () => void;
};

export function ProfileSubpageHeader({ title, onBackPress }: ProfileSubpageHeaderProps) {
  const router = useRouter();

  const handleBack = onBackPress ?? (() => router.back());

  return (
    <View className="flex-row items-center justify-between py-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        onPress={handleBack}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
      >
        <TextClassContext.Provider value="text-secondary-foreground">
          <Icon as={ChevronLeft} size={18} />
        </TextClassContext.Provider>
      </Pressable>

      <Text className="text-[22px] font-bold leading-tight text-foreground">{title}</Text>

      <View className="h-8 w-8" accessibilityElementsHidden importantForAccessibility="no" />
    </View>
  );
}
