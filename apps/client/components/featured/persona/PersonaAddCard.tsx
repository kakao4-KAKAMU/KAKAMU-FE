import { Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

type PersonaAddCardProps = {
  label: string;
  onPress: () => void;
};

export function PersonaAddCard({ label, onPress }: PersonaAddCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-[164px] w-[132px] flex-col items-center justify-center gap-2.5 rounded-[18px] border border-border bg-secondary p-3.5 active:opacity-70"
    >
      <TextClassProvider value="text-secondary-foreground">
        <Icon as={Plus} size={34} />
      </TextClassProvider>
      <Text className="text-center text-sm font-bold text-secondary-foreground">{label}</Text>
    </Pressable>
  );
}
