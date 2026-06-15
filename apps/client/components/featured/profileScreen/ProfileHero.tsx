import { View } from 'react-native';
import { User } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage, cn, Icon, Text, TextClassProvider } from '@kakamu/ui';
import type { UserInfo } from '@kakamu/types';
import { convertImagePath } from '@/lib/upload/convert-image-path';
import { useMemo } from 'react';

type ProfileHeroProps = {
  user?: UserInfo;
};

export function ProfileHero({ user }: ProfileHeroProps) {
  const personaTag = useMemo(() => {
    return user?.tag ? `@${user.nickname}#${user.tag}` : null;
  }, [user]);
  return (
    <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
      <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
        <Avatar
          className="size-16 border border-border bg-muted"
          alt={user?.nickname ?? ''}
        >
          {user?.profile_image_url ? (
            <AvatarImage source={{ uri: convertImagePath(user?.profile_image_url) }} />
          ) : null}
          <AvatarFallback className="bg-muted">
            <TextClassProvider value="text-muted-foreground">
              <Icon as={User} size={64} />
            </TextClassProvider>
          </AvatarFallback>
        </Avatar>
      </View>
      <TextClassProvider value="text-foreground">
        <Text className="text-xl font-extrabold">{user?.nickname}</Text>
      </TextClassProvider>
      <TextClassProvider value="text-muted-foreground">
        <Text className="text-center text-xs">{personaTag}</Text>
      </TextClassProvider>
    </View>
  );
}
