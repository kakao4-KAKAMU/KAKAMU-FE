import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { PostCursorListResponse } from '@kakamu/types';

export function seedDetailCache<TItem, TId>(
  queryClient: QueryClient,
  items: TItem[],
  getId: (item: TItem) => TId | null | undefined,
  detailKey: (id: TId) => readonly unknown[],
): void {
  for (const item of items) {
    const id = getId(item);
    if (id == null) {
      continue;
    }
    queryClient.setQueryData(detailKey(id), item);
  }
}

export function selectIdList<T extends { id: string | number }>(data: T[]): Array<T['id']> {
  return data.map((item) => item.id);
}

export type PostCursorIdListResponse = Omit<PostCursorListResponse, 'items'> & {
  items: number[];
};

export type PostCursorIdInfiniteData = InfiniteData<PostCursorIdListResponse, number | undefined>;

export function selectPostCursorListIds(
  data: InfiniteData<PostCursorListResponse, number | undefined>,
): PostCursorIdInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => item.id),
    })),
  };
}

export function mapInfinitePageItems<TPage, TItem, TId>(
  data: InfiniteData<TPage, unknown>,
  getItems: (page: TPage) => TItem[],
  setItems: (page: TPage, items: TId[]) => TPage,
  mapItem: (item: TItem) => TId,
): InfiniteData<TPage, unknown> {
  return {
    ...data,
    pages: data.pages.map((page) => setItems(page, getItems(page).map(mapItem))),
  };
}
