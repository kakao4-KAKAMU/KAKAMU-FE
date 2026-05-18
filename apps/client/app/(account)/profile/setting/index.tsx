import { useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ChevronRight, ShieldAlert, User } from 'lucide-react-native';
import { Button, Icon, Switch, Text, TextClassContext } from '@kakamu/ui';
import { ProfileSettingRow, ProfileSettingsHeader } from '@/components/featured/profile';

export default function ProfileSettingScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const onProfilePress = useCallback(() => {
    router.push('/profile/my');
  }, [router]);

  const onAccountSetupPress = useCallback(() => {
    router.push('/profile/setting/accountSetup');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-5 pb-6">
            <ProfileSettingsHeader
              title="설정"
              actionIcon={User}
              actionAccessibilityLabel="내 프로필"
              onActionPress={onProfilePress}
            />

            <View className="flex-col gap-2.5">
              <ProfileSettingRow
                label="계정 및 SNS 로그인"
                onPress={onAccountSetupPress}
                trailing={
                  <TextClassContext.Provider value="text-muted-foreground">
                    <Icon as={ChevronRight} size={18} />
                  </TextClassContext.Provider>
                }
              />

              <ProfileSettingRow
                label="알림 수신"
                trailing={
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => setNotificationsEnabled(checked === true)}
                    accessibilityLabel="알림 수신"
                    className="h-6 w-11"
                  />
                }
              />

              <ProfileSettingRow
                label="신고/차단 관리"
                onPress={() => {}}
                trailing={
                  <TextClassContext.Provider value="text-muted-foreground">
                    <Icon as={ShieldAlert} size={18} />
                  </TextClassContext.Provider>
                }
              />
            </View>

            <Button
              variant="destructive"
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="회원 탈퇴"
              className="w-full rounded-md"
            >
              <Text>회원 탈퇴</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
