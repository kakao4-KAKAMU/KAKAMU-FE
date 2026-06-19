export type ActivityLogCreate = {
  target_type: string;
  target_id: number | string;
  action: string;
  duration_ms?: number | null;
  metadata?: Record<string, unknown> | null;
};

export type SuccessMessageResponse = {
  message: string;
};
