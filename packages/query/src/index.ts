export { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const feedKeys = {
  all: ['feed'] as const,
  list: (cursor?: string) => [...feedKeys.all, 'list', cursor] as const,
};
