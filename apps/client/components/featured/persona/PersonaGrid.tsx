import type { Persona } from '@kakamu/types';
import { View } from 'react-native';
import { PersonaAddCard } from './PersonaAddCard';
import { PersonaCard } from './PersonaCard';

type PersonaGridProps = {
  personasIds: Persona['id'][];
  isManaging: boolean;
  addLabel: string;
  deleteAccessibilityLabel: string;
  getSelectAccessibilityLabel: (nickname: string) => string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPress: () => void;
};

export function PersonaGrid({
  personasIds,
  isManaging,
  addLabel,
  deleteAccessibilityLabel,
  getSelectAccessibilityLabel,
  onSelect,
  onDelete,
  onAddPress,
}: PersonaGridProps) {
  return (
    <View className="w-full flex-row flex-wrap items-start justify-center gap-3.5">
      {personasIds.map((personaId) => (
        <PersonaCard
          key={personaId}
          personaId={personaId}
          isManaging={isManaging}
          getSelectAccessibilityLabel={getSelectAccessibilityLabel}
          deleteAccessibilityLabel={deleteAccessibilityLabel}
          onSelect={() => onSelect(personaId)}
          onDelete={() => onDelete(personaId)}
        />
      ))}
      <PersonaAddCard label={addLabel} onPress={onAddPress} />
    </View>
  );
}
