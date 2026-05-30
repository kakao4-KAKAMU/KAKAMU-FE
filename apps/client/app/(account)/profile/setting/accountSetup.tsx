import { useCallback } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { ChevronRight, Globe, MessageCircle } from 'lucide-react-native';
import { Badge, Icon, Text, TextClassProvider } from '@kakamu/ui';
import { ProfileSubpageHeader } from '@/components/featured/header';
import {
  AccountSnsProviderRow,
  ProfileSettingRow,
} from '@/components/featured/profile';

export default function AccountSetupScreen() {
  const router = useRouter();

  const onPasswordPress = useCallback(() => {
    router.push('/profile/setting/password');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title="계정 및 SNS 로그인" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-5 pb-6">

            <View className="flex-col gap-2">
              <Text className="text-[13px] font-semibold text-muted-foreground">로그인 계정</Text>

              <View className="flex-col gap-2.5">
                <ProfileSettingRow
                  label="이메일"
                  trailing={
                    <Text className="text-sm text-muted-foreground">minji@kakamu.app</Text>
                  }
                />

                <ProfileSettingRow
                  label="비밀번호"
                  onPress={onPasswordPress}
                  trailing={
                    <TextClassProvider value="text-muted-foreground">
                      <Icon as={ChevronRight} size={18} />
                    </TextClassProvider>
                  }
                />
              </View>
            </View>

            <View className="flex-col gap-2">
              <Text className="text-[13px] font-semibold text-muted-foreground">SNS 연동</Text>

              <View className="flex-col gap-2.5">
                <AccountSnsProviderRow
                  name="카카오"
                  description="연결됨 · minji_kakao"
                  icon={
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#FEE500]">
                      <Icon as={MessageCircle} size={18} className="text-[#3C1E1E]" />
                    </View>
                  }
                  trailing={
                    <Badge variant="secondary">
                      <Text>연결됨</Text>
                    </Badge>
                  }
                />

                <AccountSnsProviderRow
                  name="Google"
                  description="연결되지 않음"
                  icon={
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
                      <TextClassProvider value="text-muted-foreground">
                        <Icon as={Globe} size={18} />
                      </TextClassProvider>
                    </View>
                  }
                  trailing={<Text className="text-[13px] font-semibold text-foreground">연결하기</Text>}
                  onPress={() => {}}
                  accessibilityLabel="Google 연결하기"
                />
              </View>
            </View>

            <Text className="text-xs leading-relaxed text-muted-foreground">
              SNS 계정을 연결하면 해당 서비스로도 로그인할 수 있습니다. 연결 해제는 각 제공사 설정에서
              진행할 수 있습니다.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
