import { View } from 'react-native';
import { User } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage, cn, Icon, Text, TextClassProvider } from '@kakamu/ui';
import type { UserPublic } from '@kakamu/types';
import { convertImagePath } from '@/lib/upload/convert-image-path';
import { useMemo } from 'react';

type ProfileHeroProps = {
  user: UserPublic;
};

export function ProfileHero({ user }: ProfileHeroProps) {
  const personaTag = `@${user.nickname}#${user.tag}`
  return (
    <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
      <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
        <Avatar
          className="size-16 border border-border bg-muted"
          alt={user.nickname}
        >
          {user.profile_image ? (
            <AvatarImage source={{ uri: convertImagePath(user.profile_image) }} />
          ) : null}
          <AvatarFallback className="bg-muted">
            <TextClassProvider value="text-muted-foreground">
              <Icon as={User} size={64} />
            </TextClassProvider>
          </AvatarFallback>
        </Avatar>
      </View>
      <TextClassProvider value="text-foreground">
        <Text className="text-xl font-extrabold">{user.nickname}</Text>
      </TextClassProvider>
      <TextClassProvider value="text-muted-foreground">
        <Text className="text-center text-xs">{personaTag}</Text>
      </TextClassProvider>
    </View>
  );
}
