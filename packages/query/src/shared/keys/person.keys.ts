export const personKeys = {
  all: ['person'] as const,
  details: () => [...personKeys.all, 'detail'] as const,
  detail: (personId: string) => [...personKeys.details(), personId] as const,
};
