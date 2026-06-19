export type Notification = {
  id: number;
  receiver_user_id: string;
  sender_persona_id: string | null;
  sender_nickname: string | null;
  type: string;
  target_type: string;
  target_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type NotificationListResponse = {
  items: Notification[];
  unread_count: number;
};
