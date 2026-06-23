export const chatKeys = {
  all: ['chat'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: () => [...chatKeys.lists()] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (sessionId: string) => [...chatKeys.details(), sessionId] as const,
  messageDetails: () => [...chatKeys.all, 'message'] as const,
  messageDetail: (messageId: number) => [...chatKeys.messageDetails(), messageId] as const,
  historyLists: () => [...chatKeys.all, 'history'] as const,
  historyList: (sessionId: string, limit: number) =>
    [...chatKeys.historyLists(), sessionId, limit] as const,
};
