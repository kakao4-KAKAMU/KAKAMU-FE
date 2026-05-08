import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import {
  IntroBackground,
  IntroCallToAction,
  IntroFeatureCardList,
  IntroHero,
  IntroTopBar,
  IntroVisualStage,
} from '@/components/featured/intro';

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
        <IntroBackground />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-[18px] pb-6 pt-[18px]">
            <IntroTopBar onSkip={onSkip} />

            <IntroHero
              title={'영화 취향이 피드가 되고,\n추천이 되는 곳'}
              description="피드, 예고편 판독, 좋아요, 저장을 페르소나별 데이터로 모아 나만의 영화 지도를 만듭니다."
            />

            <IntroVisualStage />

            <IntroFeatureCardList />

            <IntroCallToAction onPress={onStart} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
