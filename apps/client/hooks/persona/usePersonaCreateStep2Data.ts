import { useCallback, useMemo, useState } from 'react';
import { useGenreListQuery, useSearchMoviesInfiniteQuery, useSearchPersonsInfiniteQuery } from '@kakamu/query';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { MovieSort, PersonSort } from '@kakamu/types';
import { useWatch, type Control } from 'react-hook-form';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { PersonSearchJob } from '@/components/featured/persona/persona-create.constants';

type UsePersonaCreateStep2DataParams = {
  control: Control<PersonaCreateFormInput>;
};

export function usePersonaCreateStep2Data({ control }: UsePersonaCreateStep2DataParams) {
  const client = useBackendApiClient();
  const selectedGenreIds = useWatch({ control, name: 'selectedGenreIds' }) ?? [];

  const [movieKeyword, setMovieKeyword] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieSort, setMovieSort] = useState<MovieSort>('year-desc');
  const [personKeyword, setPersonKeyword] = useState('');
  const [personSort, setPersonSort] = useState<PersonSort>('name-asc');
  const [selectedJobs, setSelectedJobs] = useState<PersonSearchJob[]>([]);

  const debouncedMovieKeyword = useDebouncedValue(movieKeyword);
  const debouncedPersonKeyword = useDebouncedValue(personKeyword);

  const parsedMovieYear = useMemo(() => {
    const year = Number.parseInt(movieYear.trim(), 10);
    return Number.isFinite(year) && year > 0 ? year : undefined;
  }, [movieYear]);

  const toggleJob = useCallback((job: PersonSearchJob) => {
    setSelectedJobs((current) => (current.includes(job) ? current.filter((j) => j !== job) : [...current, job]));
  }, []);

  const genreQuery = useGenreListQuery(client);
  const movieSearchQuery = useSearchMoviesInfiniteQuery(
    client,
    {
      genre: selectedGenreIds.length > 0 ? selectedGenreIds : undefined,
      name: debouncedMovieKeyword || undefined,
      year: parsedMovieYear,
      sort: movieSort,
    },
    true,
  );
  const personSearchQuery = useSearchPersonsInfiniteQuery(
    client,
    {
      name: debouncedPersonKeyword || undefined,
      job: selectedJobs.length > 0 ? selectedJobs : undefined,
      sort: personSort,
    },
    true,
  );

  const movieItems = useMemo(
    () => movieSearchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [movieSearchQuery.data],
  );
  const personItems = useMemo(
    () => personSearchQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [personSearchQuery.data],
  );

  return {
    genreQuery,
    movieSearchQuery,
    personSearchQuery,
    movieKeyword,
    setMovieKeyword,
    movieYear,
    setMovieYear,
    movieSort,
    setMovieSort,
    personKeyword,
    setPersonKeyword,
    personSort,
    setPersonSort,
    selectedJobs,
    toggleJob,
    movieItems,
    personItems,
  };
}
