import { Pressable, View } from 'react-native';
import { Circle } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';

type PersonaFilterSortListProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function PersonaFilterSortList({ options, value, onChange }: PersonaFilterSortListProps) {
  return (
    <View className="gap-1">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPress={() => onChange(option.value)}
            className="flex-row items-center justify-between py-2.5 active:opacity-70"
          >
            <Text className={selected ? 'text-sm font-semibold text-foreground' : 'text-sm text-foreground'}>
              {option.label}
            </Text>
            <View
              className={`h-4 w-4 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary' : 'border-border'}`}
            >
              {selected ? (
                <View className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              ) : (
                <TextClassContext.Provider value="text-transparent">
                  <Icon as={Circle} size={12} />
                </TextClassContext.Provider>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
