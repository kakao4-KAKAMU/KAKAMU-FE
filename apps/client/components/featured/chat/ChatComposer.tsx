import { SendHorizontal } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Icon, Input, TextClassProvider } from '@kakamu/ui';

type ChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  isStreaming: boolean;
  placeholder: string;
  sendA11y: string;
};

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  canSend,
  isStreaming,
  placeholder,
  sendA11y,
}: ChatComposerProps) {
  return (
    <View className="flex-row items-end gap-2 border-t border-border bg-background px-4 py-3">
      <Input
        className="min-h-10 flex-1 rounded-2xl px-4 py-2.5"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!isStreaming}
        onSubmitEditing={canSend ? onSend : undefined}
        returnKeyType="send"
      />
      <Button
        size="icon"
        className="size-10 rounded-full"
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel={sendA11y}
      >
        <TextClassProvider value="text-primary-foreground">
          <Icon as={SendHorizontal} size={18} />
        </TextClassProvider>
      </Button>
    </View>
  );
}
