import { useState } from 'react';

import { usePersonaMovieSearch } from './usePersonaMovieSearch';

export function usePersonaCreateStep3Search(stepActive: boolean) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { searchQuery, ...search } = usePersonaMovieSearch(stepActive && sheetOpen);

  return {
    sheetOpen,
    setSheetOpen,
    filterOpen,
    setFilterOpen,
    searchQuery,
    search,
  };
}
