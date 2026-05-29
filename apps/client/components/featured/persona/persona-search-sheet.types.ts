import type { MovieItem, PersonSearchItem, SearchPageResponse } from '@kakamu/types';
import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type { MovieSort, PersonSort } from '@kakamu/types';

import type { PersonSearchJob } from './persona-create.constants';

export type PersonaMovieSearchControl = {
  keyword: string;
  setKeyword: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  sort: MovieSort;
  setSort: (value: MovieSort) => void;
  filterGenreIds: number[];
  setFilterGenreIds: (value: number[]) => void;
  items: MovieItem[];
};

export type PersonaPersonSearchControl = {
  keyword: string;
  setKeyword: (value: string) => void;
  sort: PersonSort;
  setSort: (value: PersonSort) => void;
  filterJobs: PersonSearchJob[];
  setFilterJobs: (value: PersonSearchJob[]) => void;
  items: PersonSearchItem[];
};

export type PersonaMovieSearchQuery = UseInfiniteQueryResult<
  InfiniteData<SearchPageResponse<MovieItem>>
>;

export type PersonaPersonSearchQuery = UseInfiniteQueryResult<
  InfiniteData<SearchPageResponse<PersonSearchItem>>
>;
