import { View } from 'react-native';
import { Avatar, Icon, Text } from '@kakamu/ui';
import { User } from 'lucide-react-native';


export function SearchPersonCardFallback() {
  return (
    <View
      className="gap-4 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/5 active:opacity-90"
    >
      <View className="flex-row items-center justify-between gap-3">
        <View
          className="min-w-0 flex-1 flex-row items-center gap-3"
        >
          <Avatar className="size-10 border border-border bg-muted" alt="Anonymous">
            <Icon as={User} size={16} className="text-muted-foreground" />
          </Avatar>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
              Anonymous
            </Text>
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}