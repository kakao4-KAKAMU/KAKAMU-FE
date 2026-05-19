import type { ProfileTab } from './types';

export function getProfileTabHref(
  isMy: boolean,
  userId: string | undefined,
  tab: ProfileTab,
): string {
  if (isMy) {
    switch (tab) {
      case 'feed':
        return '/profile/my';
      case 'like':
        return '/profile/my/like';
      case 'saved':
        return '/profile/my/saved';
    }
  }

  const id = userId ?? '';
  switch (tab) {
    case 'feed':
      return `/profile/${id}`;
    case 'like':
      return `/profile/${id}/like`;
    case 'saved':
      return `/profile/${id}/saved`;
  }
}

export function resolveActiveProfileTab(pathname: string): ProfileTab {
  if (pathname.includes('/like')) {
    return 'like';
  }
  if (pathname.includes('/saved')) {
    return 'saved';
  }
  return 'feed';
}
