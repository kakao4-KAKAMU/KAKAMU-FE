export type BindSessionId = (
  sessionId: string,
  options?: { invalidateList?: boolean; replaceRoute?: boolean },
) => void;
