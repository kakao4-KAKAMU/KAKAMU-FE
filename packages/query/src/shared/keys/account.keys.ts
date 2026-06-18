export const accountKeys = {
  all: ['account'] as const,
  authStatus: () => [...accountKeys.all, 'auth-status'] as const,
};
