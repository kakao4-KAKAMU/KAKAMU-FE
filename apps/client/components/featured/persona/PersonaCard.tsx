import type { Persona } from '@kakamu/types';
import { Image, Pressable, View } from 'react-native';
import { User, X } from 'lucide-react-native';
import { cn, Icon, Text, TextClassProvider } from '@kakamu/ui';
import { convertImagePath } from '@/lib/upload/convert-image-path';

type PersonaCardProps = {
  persona: Persona;
  isManaging: boolean;
  selectAccessibilityLabel: string;
  deleteAccessibilityLabel: string;
  onSelect: () => void;
  onDelete: () => void;
};

export function PersonaCard({
  persona,
  isManaging,
  selectAccessibilityLabel,
  deleteAccessibilityLabel,
  onSelect,
  onDelete,
}: PersonaCardProps) {
  const cardClassName = cn(
    'relative h-[164px] w-[132px] flex-col items-center justify-center gap-2.5 rounded-[18px] border border-border bg-card p-3.5',
    !isManaging && 'active:opacity-70',
  );

  const content = (
    <>
      {isManaging ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={deleteAccessibilityLabel}
          onPress={onDelete}
          hitSlop={8}
          className="absolute right-2 top-2 z-10 h-7 w-7 items-center justify-center rounded-full bg-destructive active:opacity-70"
        >
          <TextClassProvider value="text-destructive-foreground">
            <Icon as={X} size={14} />
          </TextClassProvider>
        </Pressable>
      ) : null}
      
      <Pressable
        className="flex-col items-center justify-center gap-2.5 absolute inset-0 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel={selectAccessibilityLabel}
        onPress={onSelect}
      >
        <View className="h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          {persona.profile_image_url ? (
            <Image
              source={{ uri: convertImagePath(persona.profile_image_url) }}
              accessibilityIgnoresInvertColors
              className="h-full w-full"
            />
          ) : (
            <TextClassProvider value="text-muted-foreground">
              <Icon as={User} size={22} />
            </TextClassProvider>
          )}
        </View>

        <View className="w-full flex-col items-center gap-0.5">
          <Text className="text-center text-[15px] font-bold leading-tight text-foreground">
            {persona.nickname}
          </Text>
          <Text className="text-center text-[11px] font-normal leading-tight text-muted-foreground">
            {persona.tag}
          </Text>
        </View>
      </Pressable>
    </>
  );

  return (
    <View className={cardClassName}>
      {content}
    </View>
  );
}
