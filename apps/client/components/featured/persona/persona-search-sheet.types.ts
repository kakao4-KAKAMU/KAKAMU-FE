import type { MovieSearchItem, PersonSearchItem, SearchPageResponse } from '@kakamu/types';
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
  filterGenreIds: string[];
  setFilterGenreIds: (value: string[]) => void;
  items: MovieSearchItem[];
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
  InfiniteData<SearchPageResponse<MovieSearchItem>>
>;

export type PersonaPersonSearchQuery = UseInfiniteQueryResult<
  InfiniteData<SearchPageResponse<PersonSearchItem>>
>;
