import { View } from 'react-native';
import { Button, Text } from '@kakamu/ui';

type PostWriteActionsProps = {
  cancelLabel: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
  canSubmit: boolean;
};

export function PostWriteActions({
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
  submitting,
  canSubmit,
}: PostWriteActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Button
        variant="outline"
        className="h-11 flex-1 rounded-md"
        onPress={onCancel}
        disabled={submitting}
      >
        <Text>{cancelLabel}</Text>
      </Button>
      <Button
        className="h-11 flex-1 rounded-md"
        onPress={onSubmit}
        disabled={!canSubmit || submitting}
      >
        <Text>{submitLabel}</Text>
      </Button>
    </View>
  );
}
