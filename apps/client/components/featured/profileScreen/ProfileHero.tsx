import { memo } from 'react';
import { View } from 'react-native';
import { Text, TextClassProvider } from '@kakamu/ui';
import { useUserQuery } from '@kakamu/query';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { ProfileImage } from './ProfileImage';

type ProfileHeroProps = {
  userId: string;
};

function ProfileHeroComponent({ userId }: ProfileHeroProps) {
  const apiClient = useBackendApiClient();
  const userQuery = useUserQuery(apiClient, userId);
  const user = userQuery.data;
  const personaTag = `@${user.nickname}#${user.tag}`;
  return (
    <View className="items-center gap-2.5 rounded-[14px] border border-border bg-card p-4">
      <ProfileImage nickname={user.nickname} url={user.profile_image} size={16} />
      <TextClassProvider value="text-foreground">
        <Text className="text-xl font-extrabold">{user.nickname}</Text>
      </TextClassProvider>
      <TextClassProvider value="text-muted-foreground">
        <Text className="text-center text-xs">{personaTag}</Text>
      </TextClassProvider>
    </View>
  );
}

export const ProfileHero = memo(ProfileHeroComponent);