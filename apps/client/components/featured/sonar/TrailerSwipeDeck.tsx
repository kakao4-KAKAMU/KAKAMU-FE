import { useTranslation } from '@kakamu/i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Text } from '@kakamu/ui';
import { TrailerSwipeCard } from './TrailerSwipeCard';
import { TrailerVoteButtons } from './TrailerVoteButtons';
import type { TrailerQueueItem, TrailerVote } from './types';

const MAX_VISIBLE = 3;

type PanGestureInstance = ReturnType<typeof Gesture.Pan>;

type TrailerStackCardLayerProps = {
  item: TrailerQueueItem;
  stackIndex: number;
  isFront: boolean;
  translateX: SharedValue<number>;
  rotateZ: SharedValue<number>;
  widthSv: SharedValue<number>;
  gesture: PanGestureInstance;
};

function TrailerStackCardLayer({
  item,
  stackIndex,
  isFront,
  translateX,
  rotateZ,
  widthSv,
  gesture,
}: TrailerStackCardLayerProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (isFront) {
      return {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        width: '100%',
        zIndex: 30,
        transform: [{ translateX: translateX.value }, { rotateZ: `${rotateZ.value}rad` }],
        opacity: 1,
      };
    }
    const w = widthSv.value;
    const th = w * 0.25;
    const p = Math.min(1, Math.abs(translateX.value) / th);
    const depth = stackIndex;
    const baseScale = 1 - 0.065 * depth;
    const baseY = 14 * depth;
    const baseOp = 1 - 0.14 * depth;
    const scale = interpolate(p, [0, 1], [baseScale, 1], Extrapolation.CLAMP);
    const translateY = interpolate(p, [0, 1], [baseY, 0], Extrapolation.CLAMP);
    const opacity = interpolate(p, [0, 1], [baseOp, 1], Extrapolation.CLAMP);
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      width: '100%',
      zIndex: 20 - stackIndex,
      transform: [{ scale }, { translateY }],
      opacity,
    };
  }, [isFront, stackIndex]);

  const likeTintStyle = useAnimatedStyle(() => {
    if (!isFront) return { opacity: 0 };
    const w = widthSv.value;
    return {
      opacity: interpolate(translateX.value, [0, w * 0.35], [0, 0.18], Extrapolation.CLAMP),
    };
  }, [isFront, translateX, widthSv]);

  const dislikeTintStyle = useAnimatedStyle(() => {
    if (!isFront) return { opacity: 0 };
    const w = widthSv.value;
    return {
      opacity: interpolate(translateX.value, [-w * 0.35, 0], [0.18, 0], Extrapolation.CLAMP),
    };
  }, [isFront, translateX, widthSv]);

  const inner = (
    <Animated.View className="w-full" style={animatedStyle}>
      <View className="relative w-full">
        <TrailerSwipeCard isFront={isFront} item={item} />
        {isFront ? (
          <>
            <Animated.View
              className="absolute inset-0 rounded-3xl bg-destructive/90 pointer-events-none"
              style={dislikeTintStyle}
            />
            <Animated.View
              className="absolute inset-0 rounded-3xl bg-emerald-500/90 pointer-events-none"
              style={likeTintStyle}
            />
          </>
        ) : null}
      </View>
    </Animated.View>
  );

  if (isFront) {
    return <GestureDetector gesture={gesture}>{inner}</GestureDetector>;
  }
  return inner;
}

type TrailerSwipeDeckProps = {
  initialItems: TrailerQueueItem[];
  onVote?: (vote: TrailerVote, item: TrailerQueueItem) => void;
  onQueueEmpty?: () => void;
};

export function TrailerSwipeDeck({ initialItems, onVote, onQueueEmpty }: TrailerSwipeDeckProps) {
  const { t } = useTranslation();
  const [queue, setQueue] = useState(initialItems);
  const [blocking, setBlocking] = useState(false);
  const { width: screenW } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const widthSv = useSharedValue(screenW);

  useEffect(() => {
    widthSv.value = screenW;
  }, [screenW, widthSv]);

  const finishSwipe = useCallback(
    (vote: TrailerVote) => {
      setQueue((q) => {
        if (q.length === 0) return q;
        const [head, ...rest] = q;
        onVote?.(vote, head);
        if (rest.length === 0) {
          onQueueEmpty?.();
        }
        return rest;
      });
      setBlocking(false);
    },
    [onQueueEmpty, onVote],
  );

  const startFlyOut = useCallback(
    (dir: 1 | -1) => {
      setBlocking(true);
      const exit = widthSv.value * 1.25;
      translateX.value = withTiming(dir * exit, { duration: 240 }, (finished) => {
        if (finished) {
          translateX.value = 0;
          rotateZ.value = 0;
          scheduleOnRN(finishSwipe, dir === 1 ? 'like' : 'dislike');
        }
      });
    },
    [finishSwipe, rotateZ, translateX, widthSv],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!blocking && queue.length > 0)
        .onUpdate((e) => {
          translateX.value = e.translationX;
          const w = widthSv.value;
          rotateZ.value = interpolate(e.translationX, [-w * 0.35, w * 0.35], [-0.2, 0.2], Extrapolation.CLAMP);
        })
        .onEnd(() => {
          const w = widthSv.value;
          const th = w * 0.25;
          const abs = Math.abs(translateX.value);
          if (abs > th) {
            const dir = translateX.value > 0 ? 1 : -1;
            scheduleOnRN(setBlocking, true);
            translateX.value = withTiming(dir * (w * 1.25), { duration: 220 }, (finished) => {
              if (finished) {
                translateX.value = 0;
                rotateZ.value = 0;
                scheduleOnRN(finishSwipe, dir === 1 ? 'like' : 'dislike');
              }
            });
          } else {
            translateX.value = withSpring(0, { damping: 18, stiffness: 260 });
            rotateZ.value = withSpring(0, { damping: 18, stiffness: 260 });
          }
        }),
    [blocking, finishSwipe, queue.length, rotateZ, setBlocking, translateX, widthSv],
  );

  const visible = queue.slice(0, MAX_VISIBLE);
  const ordered = visible
    .map((item, stackIndex) => ({ item, stackIndex }))
    .sort((a, b) => b.stackIndex - a.stackIndex);

  return (
    <View className="flex-1 flex-col pb-4 gap-4">
      <View className="grow w-full justify-center px-5">
        <View
          className="relative w-full grow"
          onLayout={(e) => {
            widthSv.value = e.nativeEvent.layout.width;
          }}
        >
          {visible.length === 0 ? (
            <Text className="px-4 text-center text-[15px] text-muted-foreground">
              {t('account.sonar.emptyQueue')}
            </Text>
          ) : (
            ordered.map(({ item, stackIndex }) => (
              <TrailerStackCardLayer
                key={item.id}
                gesture={pan}
                isFront={stackIndex === 0}
                item={item}
                rotateZ={rotateZ}
                stackIndex={stackIndex}
                translateX={translateX}
                widthSv={widthSv}
              />
            ))
          )}
        </View>
      </View>
      {
        Platform.OS === 'web' ? (
          <View className="px-5">
            <TrailerVoteButtons
              disabled={blocking || queue.length === 0}
              onDislike={() => {
                if (blocking || queue.length === 0) return;
                startFlyOut(-1);
              }}
              onLike={() => {
                if (blocking || queue.length === 0) return;
                startFlyOut(1);
              }}
            />
          </View>
        ) : null
      }
    </View>
  );
}
