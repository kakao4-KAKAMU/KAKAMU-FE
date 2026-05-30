import { Pressable, View } from 'react-native';
import { ChevronRight, Search } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';

type SearchTriggerProps = {
  placeholder: string;
  onPress: () => void;
};

export function SearchTrigger({ placeholder, onPress }: SearchTriggerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-10 flex-row items-center gap-2 rounded-md border border-border bg-card px-3 active:opacity-80"
    >
      <TextClassContext.Provider value="text-muted-foreground">
        <Icon as={Search} size={16} />
      </TextClassContext.Provider>
      <Text className="flex-1 text-sm text-muted-foreground">{placeholder}</Text>
      <TextClassContext.Provider value="text-muted-foreground">
        <Icon as={ChevronRight} size={16} />
      </TextClassContext.Provider>
    </Pressable>
  );
}
