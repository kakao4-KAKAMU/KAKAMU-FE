import { Separator } from '@kakamu/ui';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { View } from 'react-native';
import { Text } from '@kakamu/ui';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Modal</Text>
      <Separator className="w-4/5 height-1 my-3" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
