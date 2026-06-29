import { SendHorizontal } from 'lucide-react-native';
import { View } from 'react-native';
import { Button, Icon, Input, TextClassProvider } from '@kakamu/ui';

type CommentComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  isSubmitting: boolean;
  placeholder: string;
  sendA11y: string;
};

export function CommentComposer({
  value,
  onChangeText,
  onSend,
  canSend,
  isSubmitting,
  placeholder,
  sendA11y,
}: CommentComposerProps) {
  return (
    <View className="flex-row items-end gap-2 border-t border-border py-3">
      <Input
        className="min-h-10 flex-1 rounded-md px-3 py-2.5"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={!isSubmitting}
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
