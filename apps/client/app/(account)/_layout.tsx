import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
} from 'expo-router/ui';
import { Clapperboard, House, MessageCircle, Search, User } from 'lucide-react-native';

import { TabBar, TabButton } from '@/components/featured/tabBar';

export default function TabLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={House} label="MAIN" />
          </TabTrigger>
          <TabTrigger name="search" href="/search" asChild>
            <TabButton icon={Search} label="SEARCH" />
          </TabTrigger>
          <TabTrigger name="chat" href="/chat" asChild>
            <TabButton icon={MessageCircle} label="CHAT" />
          </TabTrigger>
          <TabTrigger name="movieTrail" href="/movieTrail" asChild>
            <TabButton icon={Clapperboard} label="SONAR" />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton icon={User} label="PROFILE" />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}
