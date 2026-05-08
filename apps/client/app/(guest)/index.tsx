import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Icon, Text, TextClassContext } from '@kakamu/ui';
import type { LucideIcon } from 'lucide-react-native';
import { Bookmark, Clapperboard, Sparkles, Users } from 'lucide-react-native';

function FeatureCard({ icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-card/80 px-3 py-3">
      <TextClassContext.Provider value="text-foreground">
        <Icon as={icon} size={18} />
        <Text className="mt-1.5 text-[12px] font-extrabold leading-none">{title}</Text>
      </TextClassContext.Provider>
    </View>
  );
}

function VisualStage() {
  return (
    <View className="relative h-[318px] w-full overflow-hidden rounded-[28px] bg-violet-900 dark:bg-violet-950">
      <View className="absolute right-2 top-0 h-[126px] w-[126px] rounded-full bg-violet-300/40 dark:bg-violet-400/20" />
      <View className="absolute bottom-4 left-0 h-[104px] w-[104px] rounded-full bg-sky-300/40 dark:bg-sky-400/25" />

      <View className="absolute left-[12%] top-10 h-[232px] w-[76%] rounded-3xl border border-border bg-card/95 p-3.5 shadow-lg shadow-black/20 dark:bg-card/90">
        <View className="mb-2.5 flex-row items-center gap-2.5">
          <View className="w-[34px] h-[34px] rounded-full bg-primary/20 items-center justify-center">
            <TextClassContext.Provider value="text-primary">
              <Icon as={Clapperboard} size={18} />
            </TextClassContext.Provider>
          </View>

          <View className="flex-1 flex flex-col gap-[2px]">
            <Text className="text-[13px] font-extrabold text-foreground leading-none">
              감성파 페르소나
            </Text>
            <Text className="text-[11px] font-normal text-muted-foreground leading-none">
              오늘의 추천 정확도 92%
            </Text>
          </View>
        </View>

        {/* 영화 메타 */}
        <View className="mb-[10px]">
          <Text className="text-[14px] font-extrabold text-foreground leading-none">Past Lives</Text>
          <Text className="mt-1 text-[11px] font-normal text-muted-foreground leading-none">
            감정 여운 · 106 min
          </Text>
        </View>

        {/* 통계 */}
        <View className="flex-row gap-2">
          <View className="flex-1 rounded-[14px] bg-violet-100 p-2.5 dark:bg-violet-500/20">
            <Text className="text-[19px] font-extrabold text-violet-900 leading-none dark:text-violet-200">
              86
            </Text>
            <Text className="mt-[2px] text-[10px] font-bold text-muted-foreground leading-none">likes</Text>
          </View>
          <View className="flex-1 rounded-[14px] bg-blue-100 p-2.5 dark:bg-blue-500/20">
            <Text className="text-[19px] font-extrabold text-blue-700 leading-none dark:text-blue-200">
              14
            </Text>
            <Text className="mt-[2px] text-[10px] font-bold text-muted-foreground leading-none">saved</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function IntroScreen() {
  const router = useRouter();

  const onSkip = React.useCallback(() => {
    router.replace('/signin');
  }, [router]);
  
  const onStart = React.useCallback(() => {
    router.replace('/signin');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ title: 'Intro' }} />

      <View className="flex-1 bg-background">
        {/* 배경 그라데이션 근사 오버레이 */}
        <View className="absolute -left-28 -top-56 h-[520px] w-[520px] rounded-full bg-violet-100/70 dark:bg-violet-900/25" />
        <View className="absolute -left-6 top-44 h-[480px] w-[480px] rounded-full bg-sky-100/85 dark:bg-sky-900/20" />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ right: 1 }}
          className="flex-1"
        >
          <View className="flex flex-col gap-4 px-[18px] pb-6 pt-[18px]">
            {/* Intro Top */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 bg-primary rounded-xl items-center justify-center">
                  <TextClassContext.Provider value="text-primary-foreground">
                    <Icon as={Clapperboard} size={18} />
                  </TextClassContext.Provider>
                </View>
                <Text className="text-[17px] font-extrabold text-foreground">Kakamu</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={onSkip} hitSlop={10}>
                <Text className="text-[13px] font-bold text-muted-foreground">Skip</Text>
              </Pressable>
            </View>

            {/* Cinematic Hero */}
            <View className="flex flex-col gap-3 pt-2">
              <View className="flex-row items-center gap-2 rounded-full border border-border bg-card/60 px-2.5 py-1.5 self-start">
                <Icon as={Sparkles} size={14} />
                <Text className="text-[11px] font-extrabold text-foreground leading-none">
                  persona-powered cinema social
                </Text>
              </View>

              <Text className="text-[34px] font-extrabold text-foreground leading-[38px]">
                영화 취향이 피드가 되고, 추천이 되는 곳
              </Text>
              <Text className="text-[14px] font-normal text-muted-foreground leading-[20px]">
                피드, 예고편 판독, 좋아요, 저장을 페르소나별 데이터로 모아 나만의 영화 지도를 만듭니다.
              </Text>
            </View>

            {/* Visual Stage */}
            <VisualStage />

            {/* Intro Feature Cards */}
            <View className="flex-row gap-2">
              <FeatureCard icon={Users} title="페르소나별 취향" />
              <FeatureCard icon={Clapperboard} title="예고편 판독" />
              <FeatureCard icon={Bookmark} title="카테고리 저장" />
            </View>

            {/* CTA */}
            <View className="pt-1 flex flex-col gap-2">
              <Button
                variant="default"
                size="lg"
                onPress={onStart}
                accessibilityRole="button"
                className="w-full rounded-full"
              >
                <Text>Kakamu 시작하기</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}