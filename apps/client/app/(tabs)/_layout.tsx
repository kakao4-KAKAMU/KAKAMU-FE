import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import {
  Pressable,
  Text,
  View,
} from 'react-native-css/components';

import { useColors } from '@/components/themeColor/useColors';

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

type TabButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  label: string;
};

function TabButton(
  { icon, label, isFocused, style: _ignoredStyle, ref, ...pressableProps }: TabButtonProps
) {
  const colors = useColors();
  const tint = isFocused ? colors['--primary'] : colors['--muted-foreground'];

  return (
    <Pressable
      ref={ref}
      className="flex-row items-center justify-center gap-2"
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      android_ripple={{ borderless: true }}
      {...pressableProps}
      style={({ pressed }) => [
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <FontAwesome name={icon} size={22} color={tint} />
      <Text className="text-sm font-medium">{label}</Text>
    </Pressable>
  );
}

export default function TabLayout() {

  return (
    <Tabs>
      <TabSlot />
      <TabList
        asChild
      >
        <View
          className="flex-row items-stretch justify-space-around border-t border-border p-2 bg-card text-card-foreground"
        >
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon="code" label="Tab One" />
          </TabTrigger>
          <TabTrigger name="two" href="/two" asChild>
            <TabButton icon="bookmark" label="Tab Two" />
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}
