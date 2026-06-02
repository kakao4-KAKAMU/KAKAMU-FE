export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: () => [...chatKeys.lists()] as const,
  historyLists: () => [...chatKeys.all, 'history'] as const,
  historyList: (sessionId: string, limit: number) =>
    [...chatKeys.historyLists(), sessionId, limit] as const,
};
