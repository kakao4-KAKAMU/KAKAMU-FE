import { Pressable } from 'react-native';
import { Badge, Icon, Text } from '@kakamu/ui';
import { EyeOff, Eye } from 'lucide-react-native';

export function CompactPostSpoilerBadge({
  revealed,
  onToggle,
  className,
}: {
  revealed: boolean;
  onToggle: () => void;
    className?: string;
  }) {
  return (
    <Pressable
      className={className}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={revealed ? '스포일러 숨기기' : '스포일러 보기'}
    >
      <Badge variant="outline" className="self-start bg-muted px-2.5 py-1">
        <Icon as={revealed ? Eye : EyeOff} size={14} className="text-muted-foreground" />
        <Text className="text-xs font-semibold text-muted-foreground">스포일러</Text>
      </Badge>
    </Pressable>
  );
}