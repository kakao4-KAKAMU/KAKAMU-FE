
import { View, Text } from 'react-native-css/components';
import { Button } from '@kakamu/ui';
import { useColorScheme } from '@/components/ColorScheme/useColorScheme';

export default function TabOneScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const changeTheme = () => {
    toggleColorScheme()
  }
  return (
    <View className="flex-1 items-center justify-center">
      <Text>{colorScheme}</Text>
      <Button onPress={changeTheme}>Click me</Button>
    </View>
  );
}
