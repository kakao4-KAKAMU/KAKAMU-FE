import { useState } from 'react';

import { usePersonaPersonSearch } from './usePersonaPersonSearch';

export function usePersonaCreateStep4Search(stepActive: boolean) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { searchQuery, ...search } = usePersonaPersonSearch(stepActive && sheetOpen);

  return {
    sheetOpen,
    setSheetOpen,
    filterOpen,
    setFilterOpen,
    searchQuery,
    search,
  };
}
