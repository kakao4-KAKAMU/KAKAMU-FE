import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { type Href, useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { Text, cn } from '@kakamu/ui';

import type {
  ProfileSavedCategory,
  ProfileSavedCategoryId,
} from '../types';

type ProfileSavedPanelProps = {
  isMy: boolean;
  categories: ProfileSavedCategory[];
  activeCategoryId?: ProfileSavedCategoryId;
  children?: ReactNode;
};

export function ProfileSavedPanel({
  isMy,
  categories,
  activeCategoryId = categories[0]?.id,
  children,
}: ProfileSavedPanelProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const onCategoryPress = useCallback(
    (categoryId: ProfileSavedCategoryId) => {
      if (!isMy) {
        return;
      }
      router.push(`/profile/my/saved/${categoryId}` as Href);
    },
    [isMy, router],
  );

  return (
    <View className="gap-2.5">
      <View className="flex-row gap-2">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <Pressable
              key={category.id}
              onPress={() => onCategoryPress(category.id)}
              accessibilityRole="button"
              className={cn(
                'flex-1 gap-1 rounded-[14px] p-3',
                isActive ? 'bg-primary' : 'bg-secondary',
              )}
            >
              <Text
                className={cn(
                  'text-[13px] font-extrabold',
                  isActive ? 'text-primary-foreground' : 'text-secondary-foreground',
                )}
              >
                {category.title}
              </Text>
              <Text
                className={cn(
                  'text-[11px]',
                  isActive ? 'text-primary-foreground opacity-80' : 'text-muted-foreground',
                )}
              >
                {t('account.profile.saved.itemCount', { count: category.itemCount })}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {children}
    </View>
  );
}
