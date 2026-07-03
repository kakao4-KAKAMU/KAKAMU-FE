import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Input } from '@kakamu/ui';

import { HeaderTemplate } from '@/components/featured/header/HeaderTemplate';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';
import { DEFAULT_SEARCH_TAB, type SearchTab } from '@/lib/search/search-tabs';

import { SearchTabBar } from './SearchTabBar';
import { ConditionalRender } from '@/components/utils';

type SearchScreenLayoutProps = {
  children: ReactNode;
};

export function SearchScreenLayout({ children }: SearchScreenLayoutProps) {
  const { t } = useTranslation();
  const currentUserId = useCurrentUser();
  const { query, activeTab, submitSearch, navigateToTab } = useSearchNavigation();
  const [draft, setDraft] = useState(query);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const onSubmit = useCallback(() => {
    const tab: SearchTab = activeTab === 'index' ? DEFAULT_SEARCH_TAB : activeTab;
    submitSearch(draft, tab);
  }, [activeTab, draft, submitSearch]);

  return (
    <View className="flex-1 bg-background">
      <HeaderTemplate title={t('account.searchHistory.title')} />
      <View className="flex-1 gap-2.5 px-4 pb-4 pt-2">
        <Input
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={onSubmit}
          placeholder={t('account.search.placeholder')}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          className="h-10"
        />
        <ConditionalRender.Boolean
          condition={activeTab !== 'index'}
          render={{
            true: <SearchTabBar
              activeTab={activeTab as SearchTab}
              showRecommend={currentUserId != null}
              onTabPress={(tab) => navigateToTab(tab, draft)}
              labels={{
                movie: t('account.search.tabs.movie'),
                feed: t('account.search.tabs.feed'),
                person: t('account.search.tabs.person'),
                recommend: t('account.search.tabs.recommend'),
              }}
            />,
            false: null,
          }}
        />
        <View className="flex-1">{children}</View>
      </View>
    </View>
  );
}
