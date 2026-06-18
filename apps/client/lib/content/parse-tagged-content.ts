import type { MentionUserItem } from '@kakamu/types';

export type TaggedContentSegment =
  | { type: 'text'; value: string }
  | { type: 'mention'; nickname: string; tag: string; raw: string }
  | { type: 'hashtag'; tag: string; raw: string };

/** @{nickname}#{tag} 멘션 또는 #해시태그 */
const TAGGED_CONTENT_PATTERN = /@([^@#\s]+)#(\S+)|#(\S+)/g;

export function parseTaggedContent(content: string): TaggedContentSegment[] {
  if (!content) {
    return [];
  }

  const segments: TaggedContentSegment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(TAGGED_CONTENT_PATTERN)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, matchIndex) });
    }

    if (match[1] != null && match[2] != null) {
      segments.push({
        type: 'mention',
        nickname: match[1],
        tag: match[2],
        raw: match[0],
      });
    } else if (match[3] != null) {
      segments.push({
        type: 'hashtag',
        tag: match[3],
        raw: match[0],
      });
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return segments;
}

export function resolveMentionUserId(
  mentions: MentionUserItem[] | undefined,
  nickname: string,
  tag: string,
): string | undefined {
  return mentions?.find((mention) => mention.nickname === nickname && mention.tag === tag)?.id;
}
