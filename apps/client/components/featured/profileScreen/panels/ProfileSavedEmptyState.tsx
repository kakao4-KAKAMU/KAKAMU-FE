import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Text } from '@kakamu/ui';

type ProfileSavedEmptyStateProps = {
  label?: string;
};

export function ProfileSavedEmptyState({ label }: ProfileSavedEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center py-8">
      <Text className="text-sm text-muted-foreground">
        {label ?? t('account.profile.saved.empty')}
      </Text>
    </View>
  );
}
