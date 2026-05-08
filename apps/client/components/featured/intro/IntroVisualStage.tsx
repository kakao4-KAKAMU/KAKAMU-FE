import { View } from 'react-native';
import { StyledLinearGradient } from './StyledLinearGradient';
import { IntroPersonaPreviewCard } from './IntroPersonaPreviewCard';

const STAGE_GRADIENT = ['#3b0764', '#5b21b6', '#7c3aed'] as const;
const STAGE_GRADIENT_START = { x: 0, y: 0 } as const;
const STAGE_GRADIENT_END = { x: 1, y: 1 } as const;

export function IntroVisualStage() {
  return (
    <View className="relative h-[318px] w-full overflow-hidden rounded-[28px]">
      <StyledLinearGradient
        className="absolute inset-0"
        colors={[...STAGE_GRADIENT]}
        start={STAGE_GRADIENT_START}
        end={STAGE_GRADIENT_END}
      />

      <View className="absolute right-2 top-0 h-[126px] w-[126px] rounded-full bg-violet-300/40 dark:bg-violet-400/20" />
      <View className="absolute bottom-4 left-0 h-[104px] w-[104px] rounded-full bg-sky-300/40 dark:bg-sky-400/25" />

      <View className="absolute left-[12%] top-10 w-[76%]">
        <IntroPersonaPreviewCard />
      </View>
    </View>
  );
}
