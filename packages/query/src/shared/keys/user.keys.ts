export const userKeys = {
  all: ['user'] as const,
  register: () => [...userKeys.all, 'register'] as const,
};
