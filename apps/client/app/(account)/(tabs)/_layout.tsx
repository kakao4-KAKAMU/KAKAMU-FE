import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { Clapperboard, House, MessageCircle, Search, User } from 'lucide-react-native';
import { usePersonaStore } from '@kakamu/store';

import { TabBar, TabButton } from '@/components/featured/tabBar';

export default function AccountTabsLayout() {
  const router = useRouter();
  const selectedPersonaId = usePersonaStore((state) => state.selectedPersonaId);

  useEffect(() => {
    if (!selectedPersonaId) {
      router.replace('/persona');
    }
  }, [router, selectedPersonaId]);

  return (
    <Tabs>
      <TabSlot style={{ flex: 1, paddingBottom: 84 }}/>
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={House} label="MAIN" />
          </TabTrigger>
          <TabTrigger name="search/index" href="/search" asChild>
            <TabButton icon={Search} label="SEARCH" />
          </TabTrigger>
          <TabTrigger name="chat/index" href="/chat" asChild>
            <TabButton icon={MessageCircle} label="CHAT" />
          </TabTrigger>
          <TabTrigger name="sonar" href="/sonar" asChild>
            <TabButton icon={Clapperboard} label="SONAR" />
          </TabTrigger>
          <TabTrigger name="profile/my" href="/profile/my" asChild>
            <TabButton icon={User} label="PROFILE" />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}
