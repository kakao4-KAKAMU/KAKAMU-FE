import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Text,
  TextClassContext,
} from '@kakamu/ui';
import { clearAuthSession } from '@/lib/auth/set-auth-tokens';
import { ConditionalRender } from '@/components/utils';

type ProfileSettingsHeaderProps = {
  title: string;
  isDropdownMenu: boolean;
  actionIcon: LucideIcon;
  actionAccessibilityLabel: string;
};

export function ProfileSettingsHeader({
  title,
  isDropdownMenu,
  actionIcon,
  actionAccessibilityLabel,
}: ProfileSettingsHeaderProps) {
  const router = useRouter();

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

  return (
    <View className="flex-row items-center justify-between px-4 py-1">
      <Text className="text-[22px] font-bold leading-tight text-foreground">{title}</Text>
      <ConditionalRender.Boolean
        render={{
          true: <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={actionAccessibilityLabel}
                hitSlop={8}
                className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
              >
                <TextClassContext.Provider value="text-secondary-foreground">
                  <Icon as={actionIcon} size={18} />
                </TextClassContext.Provider>
              </Pressable>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="bg-popover min-w-44">
              <DropdownMenuItem onPress={handleAccountSettings}>
                <Text>계정 설정</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onPress={handlePersonaSettings}>
                <Text>페르소나 설정</Text>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onPress={handleLogout}>
                <Text>로그아웃</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>,
          false: <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionAccessibilityLabel}
            onPress={handleActionPress}
            hitSlop={8}
            className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
          >
            <TextClassContext.Provider value="text-secondary-foreground">
              <Icon as={actionIcon} size={18} />
            </TextClassContext.Provider>
          </Pressable>,
        }}
        condition={isDropdownMenu}
      />
    </View>
  );
}
