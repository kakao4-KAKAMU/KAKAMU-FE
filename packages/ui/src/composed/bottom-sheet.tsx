import type { ReactNode } from 'react';
import { Modal, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Text, TextClassProvider } from './text';
import { Icon } from './icon';

type BottomSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />
        <View
          className="max-h-[82%] gap-4 rounded-t-2xl bg-background px-5 pt-5"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-foreground">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="p-1"
            >
              <TextClassProvider value="text-muted-foreground">
                <Icon as={X} size={20} />
              </TextClassProvider>
            </Pressable>
          </View>
          {children}
          {footer}
        </View>
      </View>
    </Modal>
  );
}
