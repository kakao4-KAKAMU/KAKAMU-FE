
import { View } from 'react-native';
import { Button, Text } from '@kakamu/ui';
import { useThemeScheme } from '@/components/themeScheme';

export default function TabOneScreen() {
  const { colorScheme, toggleColorScheme } = useThemeScheme()
  const changeTheme = () => {
    toggleColorScheme()
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{colorScheme}</Text>
      <Button onPress={changeTheme}>
        <Text>Click me</Text>
      </Button>
    </View>
  );
}
