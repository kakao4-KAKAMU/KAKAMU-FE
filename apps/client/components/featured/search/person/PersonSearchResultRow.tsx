import { usePersonByIdQuery } from '@kakamu/query';
import type { PersonSearchItem } from '@kakamu/types';

import { SelectedPersonRow } from './SelectedPersonRow';

type PersonSearchResultRowProps = {
  personId: string;
  checked: boolean;
  onToggle: (person: PersonSearchItem) => void;
};

export function PersonSearchResultRow({ personId, checked, onToggle }: PersonSearchResultRowProps) {
  const personQuery = usePersonByIdQuery(personId);
  const person = personQuery.data;

  return (
    <SelectedPersonRow
      name={person.name}
      checked={checked}
      onToggle={() => onToggle(person)}
    />
  );
}
