import { useTranslation } from '@kakamu/i18n';
import { Heart, ThumbsDown, ThumbsUp, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Icon, Button } from '@kakamu/ui';

type TrailerVoteButtonsProps = {
  onDislike: () => void;
  onLike: () => void;
  disabled?: boolean;
};

export function TrailerVoteButtons({ onDislike, onLike, disabled }: TrailerVoteButtonsProps) {
  const { t } = useTranslation();

  return (
    <View className="w-full flex-row items-center justify-center gap-[18px] pt-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.sonar.previewDislikeA11y')}
        disabled={disabled}
        hitSlop={8}
        onPress={onDislike}
        className="size-16 items-center justify-center rounded-full bg-muted active:opacity-80 disabled:opacity-40"
      >
        <Icon as={ThumbsDown} className="text-foreground" size={28} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('account.sonar.previewLikeA11y')}
        disabled={disabled}
        hitSlop={8}
        onPress={onLike}
        className="size-16 items-center justify-center rounded-full bg-foreground active:opacity-90 disabled:opacity-40"
      >
        <Icon as={ThumbsUp} className="text-background" size={28} />
      </Pressable>
    </View>
  );
}
