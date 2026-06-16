import { QueryCache, QueryClient } from '@kakamu/query';

export const appQueryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});
