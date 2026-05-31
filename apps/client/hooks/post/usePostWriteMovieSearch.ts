import { useState } from 'react';

import { usePersonaMovieSearch } from '@/hooks/persona/usePersonaMovieSearch';

export function usePostWriteMovieSearch(active: boolean) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { searchQuery, ...search } = usePersonaMovieSearch(active && sheetOpen);

  return {
    sheetOpen,
    setSheetOpen,
    filterOpen,
    setFilterOpen,
    searchQuery,
    search,
  };
}
