import type { MovieFilterSearchResponse, PersonFilterSearchResponse } from '@kakamu/types';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { MovieSort, PersonSort } from '@kakamu/types';

import type { PersonSearchJob } from '../persona/persona-create.constants';

export type MovieIdSearchPage = Omit<MovieFilterSearchResponse, 'items'> & {
  items: string[];
};

export type PersonIdSearchPage = Omit<PersonFilterSearchResponse, 'items'> & {
  items: string[];
};

export type MovieSearchControl = {
  keyword: string;
  setKeyword: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  sort: MovieSort;
  setSort: (value: MovieSort) => void;
  filterGenreIds: string[];
  setFilterGenreIds: (value: string[]) => void;
  items: string[];
};

export type PersonSearchControl = {
  keyword: string;
  setKeyword: (value: string) => void;
  sort: PersonSort;
  setSort: (value: PersonSort) => void;
  filterJobs: PersonSearchJob[];
  setFilterJobs: (value: PersonSearchJob[]) => void;
  items: string[];
};

export type MovieSearchQuery = UseInfiniteQueryResult<
  InfiniteData<MovieIdSearchPage, unknown>
>;

export type PersonaPersonSearchQuery = UseInfiniteQueryResult<
  InfiniteData<PersonIdSearchPage, unknown>
>;
