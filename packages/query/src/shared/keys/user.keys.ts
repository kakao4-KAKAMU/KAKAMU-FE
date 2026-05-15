export const userKeys = {
  all: ['user'] as const,
  register: () => [...userKeys.all, 'register'] as const,
  login: () => [...userKeys.all, 'login'] as const,
};
