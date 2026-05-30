import { Pressable, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Clapperboard } from 'lucide-react-native';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

type IntroTopBarProps = {
  brandName?: string;
  onSkip?: () => void;
};

export function IntroTopBar({ brandName = 'Kakamu', onSkip }: IntroTopBarProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <TextClassProvider value="text-primary-foreground">
            <Icon as={Clapperboard} size={18} />
          </TextClassProvider>
        </View>
        <Text className="text-[17px] font-extrabold text-foreground">{brandName}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('guest.intro.skip')}
        onPress={onSkip}
        hitSlop={10}
        className="active:opacity-70"
      >
        <Text className="text-[13px] font-bold text-muted-foreground">{t('guest.intro.skip')}</Text>
      </Pressable>
    </View>
  );
}
