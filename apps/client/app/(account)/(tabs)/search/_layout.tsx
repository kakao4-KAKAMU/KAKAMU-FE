import { Slot } from 'expo-router';

import { SearchScreenLayout } from '@/components/featured/search/SearchScreenLayout';

export default function SearchStackLayout() {
  return (
    <SearchScreenLayout>
      <Slot />
    </SearchScreenLayout>
  );
}
