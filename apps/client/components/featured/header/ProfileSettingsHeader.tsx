import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Text,
  Button,
  TextClassProvider,
} from '@kakamu/ui';
import { clearAuthSession } from '@/lib/auth/set-auth-tokens';
import { ConditionalRender } from '@/components/utils';
import { HeaderTemplate } from './HeaderTemplate';

type ProfileSettingsHeaderProps = {
  title: string;
  isDropdownMenu: boolean;
  actionIcon: LucideIcon;
  actionAccessibilityLabel: string;
  addFeedAccessibilityLabel?: string;
};

export function ProfileSettingsHeader({
  title,
  isDropdownMenu,
  actionIcon,
  actionAccessibilityLabel,
  addFeedAccessibilityLabel,
}: ProfileSettingsHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleActionPress = useCallback(() => {
    router.push('/profile/my');
  }, [router]);

  const handleAccountSettings = useCallback(() => {
    router.push('/profile/setting');
  }, [router]);

  const handlePersonaSettings = useCallback(() => {
    router.push('/persona');
  }, [router]);

  const handleLogout = useCallback(async () => {
    await clearAuthSession();
    router.replace('/(guest)');
  }, [router]);

  const handleAddFeed = useCallback(() => {
    router.push('/feed/write');
  }, [router]);

  return (
    <HeaderTemplate
      title={title}
      leftAction={<ConditionalRender.Boolean
        condition={isDropdownMenu}
        render={{
          true: <Button
            variant="ghost"
            size="icon"
            onPress={handleAddFeed}
            accessibilityRole="button"
            accessibilityLabel={actionAccessibilityLabel}
          >
            <TextClassProvider value="text-secondary-foreground">
              <Icon as={Plus} size={18} />
            </TextClassProvider>
          </Button>,
          false: <View className="size-10" />
        }}
      />
      }
      rightAction={<ConditionalRender.Boolean
        condition={isDropdownMenu}
        render={{
          true: <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                accessibilityRole="button"
                accessibilityLabel={actionAccessibilityLabel}
              >
                <TextClassProvider value="text-secondary-foreground">
                  <Icon as={actionIcon} size={18} />
                </TextClassProvider>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="bg-popover min-w-44">
              <DropdownMenuItem onPress={handleAccountSettings}>
                <Text>{t('account.profile.menu.accountSettings')}</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={handlePersonaSettings}>
                <Text>{t('account.profile.menu.personaSettings')}</Text>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onPress={handleLogout}>
                <Text>{t('account.profile.menu.logout')}</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
          false: <Button
            variant="outline"
            size="icon"
            onPress={handleActionPress}
            accessibilityRole="button"
            accessibilityLabel={actionAccessibilityLabel}
          >
            <TextClassProvider value="text-secondary-foreground">
              <Icon as={actionIcon} size={18} />
            </TextClassProvider>
          </Button>,
        }}
      />}
    />
  );
}
