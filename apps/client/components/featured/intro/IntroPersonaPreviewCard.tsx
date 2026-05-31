import { View } from 'react-native';
import { Clapperboard } from 'lucide-react-native';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';

export type StatItem = {
  value: string;
  label: string;
  tone?: 'violet' | 'blue';
};

type IntroPersonaPreviewCardProps = {
  personaName?: string;
  personaSubtitle?: string;
  movieTitle?: string;
  movieMeta?: string;
  stats?: StatItem[];
};

const STAT_TONE_CLASS: Record<NonNullable<StatItem['tone']>, { bg: string; value: string }> = {
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-500/20',
    value: 'text-violet-900 dark:text-violet-200',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-500/20',
    value: 'text-blue-700 dark:text-blue-200',
  },
};

const DEFAULT_STATS: StatItem[] = [
  { value: '86', label: 'likes', tone: 'violet' },
  { value: '14', label: 'saved', tone: 'blue' },
];

export function IntroPersonaPreviewCard({
  personaName = '감성파 페르소나',
  personaSubtitle = '오늘의 추천 정확도 92%',
  movieTitle = 'Past Lives',
  movieMeta = '감정 여운 · 106 min',
  stats = DEFAULT_STATS,
}: IntroPersonaPreviewCardProps) {
  return (
    <View className="rounded-3xl border border-border bg-card/95 p-3.5 shadow-lg shadow-black/20 dark:bg-card/90">
      <View className="mb-2.5 flex-row items-center gap-2.5">
        <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-primary/20">
          <TextClassProvider value="text-primary">
            <Icon as={Clapperboard} size={18} />
          </TextClassProvider>
        </View>

        <View className="flex-1 flex-col gap-[2px]">
          <Text className="text-[13px] font-extrabold text-foreground leading-none">
            {personaName}
          </Text>
          <Text className="text-[11px] font-normal text-muted-foreground leading-none">
            {personaSubtitle}
          </Text>
        </View>
      </View>

      <View className="mb-[10px]">
        <Text className="text-[14px] font-extrabold text-foreground leading-none">
          {movieTitle}
        </Text>
        <Text className="mt-1 text-[11px] font-normal text-muted-foreground leading-none">
          {movieMeta}
        </Text>
      </View>

      <View className="flex-row gap-2">
        {stats.map((stat) => {
          const tone = STAT_TONE_CLASS[stat.tone ?? 'violet'];
          return (
            <View key={stat.label} className={`flex-1 rounded-2xl p-2.5 ${tone.bg}`}>
              <Text className={`text-[19px] font-extrabold leading-none ${tone.value}`}>
                {stat.value}
              </Text>
              <Text className="mt-[2px] text-[10px] font-bold text-muted-foreground leading-none">
                {stat.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export type { StatItem as IntroPersonaStat };
