import { Pressable, View } from 'react-native';
import { ChevronRight, Search } from 'lucide-react-native';
import { Button, Icon, Text, TextClassProvider } from '@kakamu/ui';

type SearchTriggerProps = {
  placeholder: string;
  onPress: () => void;
};

export function SearchTrigger({ placeholder, onPress }: SearchTriggerProps) {
  return (
    <Button onPress={onPress} variant="outline">
      <View className="flex-1 flex-row items-center gap-2">
        <TextClassProvider value="text-muted-foreground">
          <Icon as={Search} size={16} />
          <Text className="flex-1 text-sm">{placeholder}</Text>
          <Icon as={ChevronRight} size={16} />
        </TextClassProvider>
      </View>
    </Button>
  );
}
