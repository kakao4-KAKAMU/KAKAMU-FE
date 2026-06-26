import type { ChatHistoryMessage, MovieItem } from '@kakamu/types';

export type ChatMessageFeedChip = {
  key: string;
  id: string;
  label: string;
};

function readFeedLabel(title: string | undefined, content: string | undefined): string | null {
  const trimmedTitle = title?.trim();
  if (trimmedTitle) {
    return trimmedTitle;
  }

  const trimmedContent = content?.trim();
  if (!trimmedContent) {
    return null;
  }

  return trimmedContent.length > 40 ? `${trimmedContent.slice(0, 40)}…` : trimmedContent;
}

export function resolveMessageMovies(message: ChatHistoryMessage): MovieItem[] {
  return (message.movie_list ?? []).filter(
    (movie) => Boolean(movie.poster_url?.trim()) || Boolean(movie.title?.trim()),
  );
}

export function resolveMessageFeedChips(message: ChatHistoryMessage): ChatMessageFeedChip[] {
  const chips: ChatMessageFeedChip[] = [];

  for (const feed of message.feed_list ?? []) {
    const label = readFeedLabel(feed.title, feed.content);
    if (!label) {
      continue;
    }

    chips.push({
      key: `feed-${feed.id}`,
      id: String(feed.id),
      label,
    });
  }

  return chips;
}
