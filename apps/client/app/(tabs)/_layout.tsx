import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
} from 'expo-router/ui';
import { Bookmark, House } from 'lucide-react-native';

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
          <TabTrigger name="two" href="/two" asChild>
            <TabButton icon={Bookmark} label="Tab Two" />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}
