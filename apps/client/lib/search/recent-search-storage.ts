import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SearchTab } from './search-tabs';

const STORAGE_KEY = '@kakamu/search/recent';
const MAX_RECENT_COUNT = 10;

export type RecentSearchEntry = {
  keyword: string;
  tab: SearchTab;
  selectedAt: string;
};

export async function getRecentSearches(): Promise<RecentSearchEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as RecentSearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(keyword: string, tab: SearchTab): Promise<RecentSearchEntry[]> {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return getRecentSearches();
  }

  const current = await getRecentSearches();
  const next: RecentSearchEntry[] = [
    { keyword: trimmed, tab, selectedAt: new Date().toISOString() },
    ...current.filter((entry) => entry.keyword !== trimmed),
  ].slice(0, MAX_RECENT_COUNT);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearRecentSearches(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
