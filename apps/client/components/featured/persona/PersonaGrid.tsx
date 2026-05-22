import type { Persona } from '@kakamu/types';
import { View } from 'react-native';
import { PersonaAddCard } from './PersonaAddCard';
import { PersonaCard } from './PersonaCard';

type PersonaGridProps = {
  personas: Persona[];
  isManaging: boolean;
  addLabel: string;
  deleteAccessibilityLabel: string;
  getSelectAccessibilityLabel: (nickname: string) => string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPress: () => void;
};

export function PersonaGrid({
  personas,
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
      {personas.map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          isManaging={isManaging}
          selectAccessibilityLabel={getSelectAccessibilityLabel(persona.nickname)}
          deleteAccessibilityLabel={deleteAccessibilityLabel}
          onSelect={() => onSelect(persona.id)}
          onDelete={() => onDelete(persona.id)}
        />
      ))}
      <PersonaAddCard label={addLabel} onPress={onAddPress} />
    </View>
  );
}
