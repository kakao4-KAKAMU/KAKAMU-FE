import { View } from 'react-native';
import { Button, Text } from '@kakamu/ui';

type PersonaCreateStepActionsProps = {
  backLabel: string;
  primaryLabel: string;
  onBack: () => void;
  onPrimary: () => void;
  backDisabled?: boolean;
  primaryDisabled?: boolean;
};

export function PersonaCreateStepActions({
  backLabel,
  primaryLabel,
  onBack,
  onPrimary,
  backDisabled = false,
  primaryDisabled = false,
}: PersonaCreateStepActionsProps) {
  return (
    <View className="flex-row gap-3">
      <Button
        variant="outline"
        onPress={onBack}
        disabled={backDisabled}
        className="h-11 flex-1 rounded-md"
      >
        <Text>{backLabel}</Text>
      </Button>
      <Button
        onPress={onPrimary}
        disabled={primaryDisabled}
        className="h-11 flex-1 rounded-md"
      >
        <Text>{primaryLabel}</Text>
      </Button>
    </View>
  );
}
