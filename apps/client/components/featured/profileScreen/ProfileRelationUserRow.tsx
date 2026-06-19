import { Pressable, View } from 'react-native';
import { User } from 'lucide-react-native';
import type { UserSimpleWithFollow } from '@kakamu/types';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

type ProfileRelationUserRowProps = {
  user: UserSimpleWithFollow;
  onPress: () => void;
};

export function ProfileRelationUserRow({ user, onPress }: ProfileRelationUserRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg px-1 py-2.5 active:opacity-70"
    >
      <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-muted">
        <TextClassProvider value="text-muted-foreground">
          <Icon as={User} size={18} />
        </TextClassProvider>
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
          {user.nickname}
        </Text>
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          @{user.nickname}#{user.tag}
        </Text>
      </View>
    </Pressable>
  );
}
