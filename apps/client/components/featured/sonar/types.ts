export type TrailerVote = 'like' | 'dislike';

export type TrailerQueueItem = {
  id: string;
  title: string;
  durationLabel: string;
  /** YouTube 동영상 ID (예: `dQw4w9WgXcQ`). 없으면 플레이스홀더만 표시. */
  youtubeVideoId: string;
};
